'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MessageCircle, 
  Users, 
  Clock, 
  Pin,
  Archive,
  MoreHorizontal,
  Star,
  Trash2,
  Check,
  CheckCheck
} from 'lucide-react'
import { Conversation } from '../types'
import { formatTime, formatUserName } from '../lib'

interface ConversationListProps {
  conversations: Conversation[]
  loading?: boolean
  selectedConversationId?: string
  currentUserId: string
  onConversationSelect: (conversation: Conversation) => void
  onArchiveConversation?: (conversationId: string) => void
  onDeleteConversation?: (conversationId: string) => void
  className?: string
}

export function ConversationList({
  conversations,
  loading = false,
  selectedConversationId,
  currentUserId,
  onConversationSelect,
  onArchiveConversation,
  onDeleteConversation,
  className = ''
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.title) return conversation.title
    
    const otherParticipants = conversation.participants.filter(p => p.userId !== currentUserId)
    if (otherParticipants.length === 1) {
      return otherParticipants[0].nickname || `User ${otherParticipants[0].userId.slice(-4)}`
    }
    if (otherParticipants.length > 1) {
      return `${otherParticipants[0].nickname || 'User'} & ${otherParticipants.length - 1} others`
    }
    return 'Unknown Conversation'
  }

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages yet'
    
    const { content, senderInfo, type } = conversation.lastMessage
    
    if (type === 'system') {
      return content.system?.type === 'user_joined' ? `${senderInfo.name} joined the conversation` : 'System message'
    }
    
    if (type === 'image') {
      return `${senderInfo.name} sent an image`
    }
    
    if (type === 'file') {
      return `${senderInfo.name} sent a file`
    }
    
    if (type === 'proposal') {
      return `${senderInfo.name} sent a proposal`
    }
    
    return content.text || 'Message'
  }

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.unreadCount[currentUserId] || 0
  }

  const getConversationTypeIcon = (type: Conversation['type']) => {
    switch (type) {
      case 'direct':
        return <MessageCircle className="w-4 h-4" />
      case 'group':
        return <Users className="w-4 h-4" />
      case 'project':
        return <Star className="w-4 h-4" />
      case 'support':
        return <MessageCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const getMessageStatusIcon = (conversation: Conversation) => {
    if (!conversation.lastMessage) return null
    
    const lastMessage = conversation.lastMessage
    const isFromCurrentUser = lastMessage.senderId === currentUserId
    
    if (!isFromCurrentUser) return null
    
    const isRead = lastMessage.readBy.some(r => r.userId !== currentUserId)
    
    if (isRead) {
      return <CheckCheck className="w-3 h-3 text-violet-600" />
    } else {
      return <Check className="w-3 h-3 text-navy-400" />
    }
  }

  const getPriorityColor = (priority?: Conversation['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-500'
      case 'high':
        return 'bg-orange-100 border-orange-500'
      case 'medium':
        return 'bg-yellow-100 border-yellow-500'
      default:
        return ''
    }
  }

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true
    
    const title = getConversationTitle(conversation).toLowerCase()
    const lastMessage = getLastMessagePreview(conversation).toLowerCase()
    
    return title.includes(searchQuery.toLowerCase()) || 
           lastMessage.includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={`${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-navy-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-900">Messages</h2>
          <Badge variant="outline" className="text-navy-600">
            {conversations.length}
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-navy-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-navy-300 mx-auto mb-4" />
            <p className="text-navy-600 mb-2">No conversations found</p>
            <p className="text-sm text-navy-400">
              {searchQuery ? 'Try adjusting your search' : 'Start a new conversation to get started'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-navy-100">
            {filteredConversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation)
              const isSelected = conversation._id === selectedConversationId
              const title = getConversationTitle(conversation)
              const lastMessagePreview = getLastMessagePreview(conversation)
              const priorityColor = getPriorityColor(conversation.priority)
              
              return (
                <div
                  key={conversation._id}
                  className={`p-4 hover:bg-navy-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-violet-50 border-r-2 border-violet-500' : ''
                  } ${priorityColor}`}
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Conversation Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                        {getConversationTypeIcon(conversation.type)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium truncate ${
                          unreadCount > 0 ? 'text-navy-900' : 'text-navy-700'
                        }`}>
                          {title}
                        </h3>
                        
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {conversation.lastMessage && (
                            <>
                              {getMessageStatusIcon(conversation)}
                              <span className="text-xs text-navy-500">
                                {formatTime(conversation.lastMessage.createdAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm truncate ${
                        unreadCount > 0 ? 'text-navy-800 font-medium' : 'text-navy-600'
                      }`}>
                        {lastMessagePreview}
                      </p>
                      
                      {/* Tags and Status */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {conversation.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          
                          {conversation.status === 'archived' && (
                            <Badge variant="outline" className="text-xs">
                              <Archive className="w-3 h-3 mr-1" />
                              Archived
                            </Badge>
                          )}
                        </div>
                        
                        {unreadCount > 0 && (
                          <Badge className="bg-violet-600 text-white text-xs min-w-5 h-5 flex items-center justify-center rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
