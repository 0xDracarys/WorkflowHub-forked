import clientPromise from '../../lib/mongodb'
import { 
  Conversation, 
  Message, 
  ConversationSearchFilters,
  MessageSearchFilters,
  ApiResponse,
  PaginationParams
} from '../types'

export class ConversationAPI {
  private static readonly CONVERSATIONS_COLLECTION = 'workflowhub_conversations'
  private static readonly MESSAGES_COLLECTION = 'workflowhub_messages'

  // Conversation Operations
  static async createConversation(conversationData: Omit<Conversation, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Conversation>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const newConversation: Conversation = {
        ...conversationData,
        unreadCount: {},
        settings: conversationData.settings || {
          notifications: true,
          autoArchive: false,
          allowFileSharing: true,
          allowLinkSharing: true,
          messagingRestrictions: {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedFileTypes: ['image/*', 'document/*', 'video/*'],
            maxMessageLength: 5000
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(newConversation)
      
      if (result.acknowledged) {
        const createdConversation = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdConversation!,
          message: 'Conversation created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create conversation'
        }
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getConversation(conversationId: string): Promise<ApiResponse<Conversation>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const conversation = await collection.findOne({ _id: conversationId })
      
      if (conversation) {
        return {
          success: true,
          data: conversation
        }
      } else {
        return {
          success: false,
          error: 'Conversation not found'
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getUserConversations(
    userId: string, 
    filters: ConversationSearchFilters = {}, 
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<{ conversations: Conversation[], total: number }>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const { page = 1, limit = 20, sortBy = 'updatedAt', sortOrder = 'desc' } = pagination
      const skip = (page - 1) * limit

      // Build query
      const query: any = {
        'participants.userId': userId
      }

      if (filters.type) {
        query.type = filters.type
      }

      if (filters.status) {
        query.status = filters.status
      }

      if (filters.hasUnread) {
        query[`unreadCount.${userId}`] = { $gt: 0 }
      }

      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags }
      }

      if (filters.priority) {
        query.priority = filters.priority
      }

      if (filters.dateRange) {
        query.createdAt = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end
        }
      }

      const conversations = await collection
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await collection.countDocuments(query)

      return {
        success: true,
        data: { conversations, total }
      }
    } catch (error) {
      console.error('Error fetching user conversations:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateConversation(conversationId: string, updateData: Partial<Conversation>): Promise<ApiResponse<Conversation>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const result = await collection.findOneAndUpdate(
        { _id: conversationId },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Conversation updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'Conversation not found'
        }
      }
    } catch (error) {
      console.error('Error updating conversation:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Message Operations
  static async sendMessage(messageData: Omit<Message, '_id' | 'createdAt' | 'reactions' | 'readBy' | 'isEdited' | 'isDeleted' | 'reportCount'>): Promise<ApiResponse<Message>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const messagesCollection = db.collection<Message>(this.MESSAGES_COLLECTION)
      const conversationsCollection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const newMessage: Message = {
        ...messageData,
        reactions: [],
        readBy: [{
          userId: messageData.senderId,
          readAt: new Date()
        }],
        isEdited: false,
        isDeleted: false,
        reportCount: 0,
        createdAt: new Date()
      }

      // Insert the message
      const result = await messagesCollection.insertOne(newMessage)
      
      if (result.acknowledged) {
        const createdMessage = await messagesCollection.findOne({ _id: result.insertedId })
        
        // Update conversation's last message and unread counts
        const conversation = await conversationsCollection.findOne({ _id: messageData.conversationId })
        if (conversation) {
          const unreadCount = { ...conversation.unreadCount }
          
          // Increment unread count for all participants except sender
          conversation.participants.forEach(participant => {
            if (participant.userId !== messageData.senderId) {
              unreadCount[participant.userId] = (unreadCount[participant.userId] || 0) + 1
            }
          })

          await conversationsCollection.updateOne(
            { _id: messageData.conversationId },
            {
              $set: {
                lastMessage: createdMessage,
                unreadCount,
                updatedAt: new Date()
              }
            }
          )
        }

        return {
          success: true,
          data: createdMessage!,
          message: 'Message sent successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to send message'
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getMessages(
    conversationId: string, 
    filters: MessageSearchFilters = {}, 
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<{ messages: Message[], total: number }>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Message>(this.MESSAGES_COLLECTION)

      const { page = 1, limit = 50, sortBy = 'createdAt', sortOrder = 'desc' } = pagination
      const skip = (page - 1) * limit

      const query: any = {
        conversationId,
        isDeleted: false
      }

      if (filters.senderId) {
        query.senderId = filters.senderId
      }

      if (filters.type) {
        query.type = filters.type
      }

      if (filters.hasAttachments) {
        query['content.media'] = { $exists: true, $ne: [] }
      }

      if (filters.content) {
        query['content.text'] = { $regex: filters.content, $options: 'i' }
      }

      if (filters.dateRange) {
        query.createdAt = {
          $gte: filters.dateRange.start,
          $lte: filters.dateRange.end
        }
      }

      const messages = await collection
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await collection.countDocuments(query)

      return {
        success: true,
        data: { messages, total }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async markMessagesAsRead(conversationId: string, userId: string, messageIds: string[] = []): Promise<ApiResponse<void>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const messagesCollection = db.collection<Message>(this.MESSAGES_COLLECTION)
      const conversationsCollection = db.collection<Conversation>(this.CONVERSATIONS_COLLECTION)

      const query: any = { conversationId }
      if (messageIds.length > 0) {
        query._id = { $in: messageIds }
      }

      // Update messages
      await messagesCollection.updateMany(
        query,
        {
          $addToSet: {
            readBy: {
              userId,
              readAt: new Date()
            }
          }
        }
      )

      // Reset unread count for this user in the conversation
      await conversationsCollection.updateOne(
        { _id: conversationId },
        {
          $set: {
            [`unreadCount.${userId}`]: 0,
            updatedAt: new Date()
          }
        }
      )

      return {
        success: true,
        message: 'Messages marked as read'
      }
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async editMessage(messageId: string, newContent: Message['content']): Promise<ApiResponse<Message>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Message>(this.MESSAGES_COLLECTION)

      const result = await collection.findOneAndUpdate(
        { _id: messageId },
        { 
          $set: { 
            content: newContent,
            isEdited: true,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Message updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'Message not found'
        }
      }
    } catch (error) {
      console.error('Error editing message:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Message>(this.MESSAGES_COLLECTION)

      const result = await collection.updateOne(
        { _id: messageId },
        { 
          $set: { 
            isDeleted: true,
            content: { text: 'This message has been deleted' },
            updatedAt: new Date()
          } 
        }
      )

      if (result.modifiedCount > 0) {
        return {
          success: true,
          message: 'Message deleted successfully'
        }
      } else {
        return {
          success: false,
          error: 'Message not found'
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async addReaction(messageId: string, userId: string, emoji: string): Promise<ApiResponse<Message>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Message>(this.MESSAGES_COLLECTION)

      const message = await collection.findOne({ _id: messageId })
      if (!message) {
        return {
          success: false,
          error: 'Message not found'
        }
      }

      const reactions = [...message.reactions]
      const existingReaction = reactions.find(r => r.emoji === emoji)

      if (existingReaction) {
        if (!existingReaction.users.includes(userId)) {
          existingReaction.users.push(userId)
          existingReaction.count++
        }
      } else {
        reactions.push({
          emoji,
          users: [userId],
          count: 1
        })
      }

      const result = await collection.findOneAndUpdate(
        { _id: messageId },
        { 
          $set: { 
            reactions,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Reaction added successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to add reaction'
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async removeReaction(messageId: string, userId: string, emoji: string): Promise<ApiResponse<Message>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Message>(this.MESSAGES_COLLECTION)

      const message = await collection.findOne({ _id: messageId })
      if (!message) {
        return {
          success: false,
          error: 'Message not found'
        }
      }

      const reactions = message.reactions.map(reaction => {
        if (reaction.emoji === emoji && reaction.users.includes(userId)) {
          const updatedUsers = reaction.users.filter(id => id !== userId)
          return {
            ...reaction,
            users: updatedUsers,
            count: updatedUsers.length
          }
        }
        return reaction
      }).filter(reaction => reaction.count > 0)

      const result = await collection.findOneAndUpdate(
        { _id: messageId },
        { 
          $set: { 
            reactions,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Reaction removed successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to remove reaction'
        }
      }
    } catch (error) {
      console.error('Error removing reaction:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Utility methods
  static async archiveConversation(conversationId: string): Promise<ApiResponse<void>> {
    return this.updateConversation(conversationId, { status: 'archived' })
      .then(result => ({ success: result.success, message: 'Conversation archived' }))
  }

  static async unarchiveConversation(conversationId: string): Promise<ApiResponse<void>> {
    return this.updateConversation(conversationId, { status: 'active' })
      .then(result => ({ success: result.success, message: 'Conversation unarchived' }))
  }

  static async blockConversation(conversationId: string): Promise<ApiResponse<void>> {
    return this.updateConversation(conversationId, { status: 'blocked' })
      .then(result => ({ success: result.success, message: 'Conversation blocked' }))
  }
}
