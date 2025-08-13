'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Reply,
  MoreHorizontal,
  Download,
  Eye,
  Heart,
  Smile,
  Check,
  CheckCheck
} from 'lucide-react'
import { Message } from '../types'
import { formatTime, formatFileSize, isImageFile, isVideoFile, isAudioFile } from '../lib'

interface MessageBubbleProps {
  message: Message
  isFromCurrentUser: boolean
  showSenderInfo?: boolean
  currentUserId: string
  onEdit?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onReply?: (messageId: string) => void
  onReaction?: (messageId: string, emoji: string) => void
  className?: string
}

export function MessageBubble({
  message,
  isFromCurrentUser,
  showSenderInfo = true,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  onReaction,
  className = ''
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)

  const getMessageStatusIcon = () => {
    if (!isFromCurrentUser) return null
    
    const isReadByOthers = message.readBy.some(r => r.userId !== currentUserId)
    
    if (isReadByOthers) {
      return <CheckCheck className="w-3 h-3 text-violet-600" />
    } else {
      return <Check className="w-3 h-3 text-navy-400" />
    }
  }

  const renderSystemMessage = () => {
    if (message.type !== 'system') return null
    
    return (
      <div className="flex justify-center my-4">
        <Badge variant="outline" className="bg-navy-50 text-navy-600 text-xs">
          {message.content.text}
        </Badge>
      </div>
    )
  }

  const renderMediaAttachments = () => {
    if (!message.content.media || message.content.media.length === 0) return null
    
    return (
      <div className="space-y-2">
        {message.content.media.map((media) => (
          <div key={media.id} className="relative">
            {isImageFile(media.mimeType) && (
              <img
                src={media.url}
                alt={media.fileName}
                className="max-w-sm rounded-lg cursor-pointer hover:opacity-90"
                onClick={() => window.open(media.url, '_blank')}
              />
            )}
            
            {isVideoFile(media.mimeType) && (
              <video
                src={media.url}
                controls
                className="max-w-sm rounded-lg"
                poster={media.thumbnail}
              />
            )}
            
            {isAudioFile(media.mimeType) && (
              <audio src={media.url} controls className="w-full max-w-sm" />
            )}
            
            {!isImageFile(media.mimeType) && !isVideoFile(media.mimeType) && !isAudioFile(media.mimeType) && (
              <Card className="p-3 max-w-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                    <Download className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-900 truncate">{media.fileName}</p>
                    <p className="text-sm text-navy-600">{formatFileSize(media.fileSize)}</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderProposal = () => {
    if (message.type !== 'proposal' || !message.content.proposal) return null
    
    const proposal = message.content.proposal
    
    return (
      <Card className="p-4 max-w-md">
        <div className="flex items-center space-x-2 mb-3">
          <CheckCircle className="w-5 h-5 text-violet-600" />
          <h4 className="font-semibold text-navy-900">Project Proposal</h4>
          <Badge variant="outline" className={`text-xs ${
            proposal.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
            proposal.status === 'declined' ? 'bg-red-50 text-red-700' :
            'bg-yellow-50 text-yellow-700'
          }`}>
            {proposal.status}
          </Badge>
        </div>
        
        <h5 className="font-medium text-navy-900 mb-2">{proposal.title}</h5>
        <p className="text-sm text-navy-700 mb-3">{proposal.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-navy-600">Budget:</span>
            <span className="font-medium text-navy-900">${proposal.budget}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-600">Timeline:</span>
            <span className="font-medium text-navy-900">{proposal.timeline}</span>
          </div>
        </div>
        
        {proposal.status === 'sent' && !isFromCurrentUser && (
          <div className="flex space-x-2 mt-4">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Accept
            </Button>
            <Button size="sm" variant="outline">
              Negotiate
            </Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-200">
              Decline
            </Button>
          </div>
        )}
      </Card>
    )
  }

  const renderPayment = () => {
    if (message.type !== 'payment' || !message.content.payment) return null
    
    const payment = message.content.payment
    
    return (
      <Card className="p-4 max-w-md">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 text-sm font-bold">$</span>
          </div>
          <h4 className="font-semibold text-navy-900">Payment</h4>
          <Badge variant="outline" className={`text-xs ${
            payment.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
            payment.status === 'failed' ? 'bg-red-50 text-red-700' :
            'bg-yellow-50 text-yellow-700'
          }`}>
            {payment.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-navy-600">Amount:</span>
            <span className="font-bold text-navy-900">${payment.amount} {payment.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-600">Method:</span>
            <span className="font-medium text-navy-900">{payment.method}</span>
          </div>
          {payment.transactionId && (
            <div className="flex justify-between">
              <span className="text-navy-600">Transaction:</span>
              <span className="font-mono text-xs text-navy-700">{payment.transactionId}</span>
            </div>
          )}
        </div>
      </Card>
    )
  }

  const renderReactions = () => {
    if (message.reactions.length === 0) return null
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {message.reactions.map((reaction) => {
          const hasReacted = reaction.users.includes(currentUserId)
          
          return (
            <Button
              key={reaction.emoji}
              variant="ghost"
              size="sm"
              className={`h-6 px-2 text-xs ${
                hasReacted ? 'bg-violet-100 text-violet-700' : 'hover:bg-navy-50'
              }`}
              onClick={() => onReaction?.(message._id!, reaction.emoji)}
            >
              <span className="mr-1">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </Button>
          )
        })}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => onReaction?.(message._id!, '👍')}
        >
          <Smile className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  if (message.type === 'system') {
    return renderSystemMessage()
  }

  return (
    <div className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}>
      <div
        className={`max-w-lg ${isFromCurrentUser ? 'order-2' : 'order-1'}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Sender Info */}
        {showSenderInfo && !isFromCurrentUser && (
          <div className="flex items-center space-x-2 mb-1">
            <img
              src={message.senderInfo.avatar || '/placeholder-user.jpg'}
              alt={message.senderInfo.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium text-navy-900">{message.senderInfo.name}</span>
            {message.senderInfo.isVerified && (
              <CheckCircle className="w-3 h-3 text-violet-600" />
            )}
            <Badge className="text-xs bg-violet-100 text-violet-800">
              {message.senderInfo.userType}
            </Badge>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`relative ${
            isFromCurrentUser
              ? 'bg-violet-600 text-white rounded-2xl rounded-tr-sm'
              : 'bg-white border border-navy-200 text-navy-900 rounded-2xl rounded-tl-sm'
          } px-4 py-2 shadow-sm`}
        >
          {/* Text Content */}
          {message.content.text && (
            <p className="whitespace-pre-wrap break-words mb-2">{message.content.text}</p>
          )}
          
          {/* Media Attachments */}
          {renderMediaAttachments()}
          
          {/* Special Content Types */}
          {renderProposal()}
          {renderPayment()}
          
          {/* Message Info */}
          <div className={`flex items-center justify-between mt-2 text-xs ${
            isFromCurrentUser ? 'text-violet-200' : 'text-navy-500'
          }`}>
            <div className="flex items-center space-x-1">
              {message.isEdited && <span>(edited)</span>}
              <span>{formatTime(message.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              {getMessageStatusIcon()}
            </div>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className={`absolute top-0 ${isFromCurrentUser ? 'left-0 -ml-20' : 'right-0 -mr-20'} flex items-center space-x-1`}>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-navy-50"
                onClick={() => onReply?.(message._id!)}
              >
                <Reply className="w-3 h-3" />
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-navy-50"
                onClick={() => onReaction?.(message._id!, '👍')}
              >
                <Heart className="w-3 h-3" />
              </Button>
              
              {isFromCurrentUser && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-navy-50"
                    onClick={() => onEdit?.(message._id!)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-red-50 text-red-600"
                    onClick={() => onDelete?.(message._id!)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Reactions */}
        {renderReactions()}
      </div>
    </div>
  )
}
