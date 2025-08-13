import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Conversation, 
  Message, 
  ConversationSearchFilters, 
  MessageSearchFilters,
  TypingStatus,
  OnlineStatus 
} from '../types'
import { ConversationAPI } from '../lib'
import { mockConversations, mockMessages } from '../lib/mock-data'

export function useConversations(userId: string, filters: ConversationSearchFilters = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchConversations = useCallback(async (page: number = 1, limit: number = 20) => {
    setLoading(true)
    setError(null)
    
    try {
      // Use mock data for demo
      setTimeout(() => {
        setConversations(mockConversations)
        setTotal(mockConversations.length)
        setLoading(false)
      }, 300)
    } catch (err) {
      setError('Network error occurred')
      setLoading(false)
    }
  }, [userId, filters])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const createConversation = async (conversationData: Omit<Conversation, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await ConversationAPI.createConversation(conversationData)
      if (response.success && response.data) {
        setConversations(prev => [response.data!, ...prev])
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const updateConversation = async (conversationId: string, updateData: Partial<Conversation>) => {
    try {
      const response = await ConversationAPI.updateConversation(conversationId, updateData)
      if (response.success && response.data) {
        setConversations(prev => 
          prev.map(conv => conv._id === conversationId ? response.data! : conv)
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const archiveConversation = async (conversationId: string) => {
    const response = await updateConversation(conversationId, { status: 'archived' })
    return response
  }

  const deleteConversation = async (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv._id !== conversationId))
    return { success: true }
  }

  return {
    conversations,
    loading,
    error,
    total,
    createConversation,
    updateConversation,
    archiveConversation,
    deleteConversation,
    refetch: fetchConversations
  }
}

export function useConversation(conversationId: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversation = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await ConversationAPI.getConversation(conversationId)
      if (response.success) {
        setConversation(response.data || null)
      } else {
        setError(response.error || 'Failed to fetch conversation')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
    }
  }, [conversationId, fetchConversation])

  return {
    conversation,
    loading,
    error,
    setConversation,
    refetch: fetchConversation
  }
}

export function useMessages(conversationId: string, filters: MessageSearchFilters = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchMessages = useCallback(async (page: number = 1, limit: number = 50, append: boolean = false) => {
    setLoading(true)
    if (!append) setError(null)
    
    try {
      // Use mock data for demo
      setTimeout(() => {
        const conversationMessages = mockMessages[conversationId] || []
        
        if (append) {
          setMessages(prev => [...prev, ...conversationMessages])
        } else {
          setMessages(conversationMessages)
        }
        
        setTotal(conversationMessages.length)
        setHasMore(false)
        setLoading(false)
      }, 200)
    } catch (err) {
      setError('Network error occurred')
      setLoading(false)
    }
  }, [conversationId, filters])

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId, fetchMessages])

  const sendMessage = async (messageData: Omit<Message, '_id' | 'createdAt' | 'reactions' | 'readBy' | 'isEdited' | 'isDeleted' | 'reportCount'>) => {
    try {
      // Create a mock message for demo
      const newMessage: Message = {
        _id: `msg_${Date.now()}`,
        ...messageData,
        reactions: [],
        readBy: [{ userId: messageData.senderId, readAt: new Date() }],
        isEdited: false,
        isDeleted: false,
        reportCount: 0,
        createdAt: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      return { success: true, data: newMessage }
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const editMessage = async (messageId: string, newContent: Message['content']) => {
    try {
      const response = await ConversationAPI.editMessage(messageId, newContent)
      if (response.success && response.data) {
        setMessages(prev => 
          prev.map(msg => msg._id === messageId ? response.data! : msg)
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await ConversationAPI.deleteMessage(messageId)
      if (response.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg._id === messageId 
              ? { ...msg, isDeleted: true, content: { text: 'This message has been deleted' } }
              : msg
          )
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const addReaction = async (messageId: string, userId: string, emoji: string) => {
    try {
      const response = await ConversationAPI.addReaction(messageId, userId, emoji)
      if (response.success && response.data) {
        setMessages(prev => 
          prev.map(msg => msg._id === messageId ? response.data! : msg)
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const removeReaction = async (messageId: string, userId: string, emoji: string) => {
    try {
      const response = await ConversationAPI.removeReaction(messageId, userId, emoji)
      if (response.success && response.data) {
        setMessages(prev => 
          prev.map(msg => msg._id === messageId ? response.data! : msg)
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const markAsRead = async (userId: string, messageIds?: string[]) => {
    try {
      const response = await ConversationAPI.markMessagesAsRead(conversationId, userId, messageIds)
      if (response.success) {
        // Update local messages to mark as read
        setMessages(prev => 
          prev.map(msg => {
            const readBy = [...msg.readBy]
            if (!readBy.some(r => r.userId === userId)) {
              readBy.push({ userId, readAt: new Date() })
            }
            return { ...msg, readBy }
          })
        )
      }
      return response
    } catch (err) {
      return { success: false, error: 'Network error occurred' }
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = Math.ceil(messages.length / 50) + 1
      fetchMessages(nextPage, 50, true)
    }
  }

  return {
    messages,
    loading,
    error,
    total,
    hasMore,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    markAsRead,
    loadMore,
    refetch: () => fetchMessages()
  }
}

export function useTypingStatus(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([])
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const setUserTyping = useCallback((userId: string, isTyping: boolean) => {
    const timeout = typingTimeouts.current.get(userId)
    if (timeout) {
      clearTimeout(timeout)
      typingTimeouts.current.delete(userId)
    }

    if (isTyping) {
      setTypingUsers(prev => {
        const existing = prev.find(t => t.userId === userId)
        if (existing) {
          return prev.map(t => 
            t.userId === userId 
              ? { ...t, isTyping: true, timestamp: new Date() }
              : t
          )
        }
        return [...prev, { conversationId, userId, isTyping: true, timestamp: new Date() }]
      })

      // Auto-clear typing status after 3 seconds
      const newTimeout = setTimeout(() => {
        setTypingUsers(prev => prev.filter(t => t.userId !== userId))
        typingTimeouts.current.delete(userId)
      }, 3000)
      
      typingTimeouts.current.set(userId, newTimeout)
    } else {
      setTypingUsers(prev => prev.filter(t => t.userId !== userId))
    }
  }, [conversationId])

  const clearTypingStatus = useCallback((userId: string) => {
    setUserTyping(userId, false)
  }, [setUserTyping])

  return {
    typingUsers,
    setUserTyping,
    clearTypingStatus
  }
}

export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, OnlineStatus>>(new Map())

  const updateUserStatus = useCallback((userId: string, isOnline: boolean, lastSeen?: Date) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev)
      newMap.set(userId, { userId, isOnline, lastSeen })
      return newMap
    })
  }, [])

  const getUserStatus = useCallback((userId: string) => {
    return onlineUsers.get(userId) || { userId, isOnline: false }
  }, [onlineUsers])

  return {
    updateUserStatus,
    getUserStatus,
    onlineUsers: Array.from(onlineUsers.values())
  }
}

export function useMessageSearch() {
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchMessages = async (
    conversationId: string, 
    query: string, 
    filters: MessageSearchFilters = {}
  ) => {
    setLoading(true)
    setError(null)
    
    try {
      const searchFilters = { ...filters, content: query }
      const response = await ConversationAPI.getMessages(conversationId, searchFilters)
      
      if (response.success && response.data) {
        setSearchResults(response.data.messages)
      } else {
        setError(response.error || 'Search failed')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchResults([])
    setError(null)
  }

  return {
    searchResults,
    loading,
    error,
    searchMessages,
    clearSearch
  }
}
