'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageCircle, 
  Users, 
  Bell, 
  Settings,
  TrendingUp,
  DollarSign,
  Star,
  Calendar,
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Activity,
  Share2
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { UserProfile, Conversation, Message } from '../types'
import { useUser, useUserStats, useConversations, useMessages } from '../hooks'
import { UserProfileCard } from './UserProfileCard'
import { ConversationList } from './ConversationList'
import { MessageBubble } from './MessageBubble'
import { formatTime, formatUserName } from '../lib'
import { ProfileShareModal } from '../../components/ProfileShareModal'

interface UserDashboardProps {
  currentUser: UserProfile
  className?: string
}

export function UserDashboard({ currentUser, className = '' }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'conversations' | 'profile' | 'settings'>('overview')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)

  // Hooks
  const { user, updateUser } = useUser(currentUser.clerkId)
  const { stats } = useUserStats(currentUser.clerkId)
  const { conversations, createConversation } = useConversations(currentUser._id!, { status: 'active' })
  const { 
    messages, 
    sendMessage, 
    markAsRead 
  } = useMessages(selectedConversation?._id || '', {})

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return

    const messageData = {
      conversationId: selectedConversation._id!,
      senderId: currentUser._id!,
      senderInfo: {
        name: formatUserName(currentUser.firstName, currentUser.lastName, currentUser.username),
        avatar: currentUser.imageUrl,
        userType: currentUser.userType,
        isVerified: currentUser.isVerified
      },
      type: 'text' as const,
      content: {
        text: messageInput
      },
      status: 'sent' as const
    }

    const response = await sendMessage(messageData)
    if (response.success) {
      setMessageInput('')
    }
  }

  const handleStartConversation = async () => {
    // This would typically open a modal to select users
    // For demo purposes, we'll create a basic conversation structure
    const newConversation = {
      participants: [
        {
          userId: currentUser._id!,
          role: currentUser.userType,
          joinedAt: new Date(),
          permissions: {
            canSendMessages: true,
            canSendMedia: true,
            canAddParticipants: false,
            canRemoveParticipants: false,
            canEditConversation: false,
            canArchiveConversation: true
          },
          isActive: true
        }
      ],
      type: 'direct' as const,
      status: 'active' as const,
      settings: {
        notifications: true,
        autoArchive: false,
        allowFileSharing: true,
        allowLinkSharing: true,
        messagingRestrictions: {
          maxFileSize: 10 * 1024 * 1024,
          allowedFileTypes: ['image/*', 'document/*'],
          maxMessageLength: 5000
        }
      }
    }

    await createConversation(newConversation)
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 bg-gradient-to-r from-violet-50 to-navy-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900 mb-2">
              Welcome back, {currentUser.firstName}!
            </h1>
            <p className="text-navy-600">
              {currentUser.userType === 'influencer' && 'Manage your collaborations and grow your influence'}
              {currentUser.userType === 'provider' && 'Track your projects and client relationships'}
              {currentUser.userType === 'client' && 'Connect with top influencers and service providers'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${
              currentUser.userType === 'influencer' ? 'bg-violet-100 text-violet-800' :
              currentUser.userType === 'provider' ? 'bg-emerald-100 text-emerald-800' :
              'bg-navy-100 text-navy-800'
            }`}>
              {currentUser.userType.charAt(0).toUpperCase() + currentUser.userType.slice(1)}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-violet-600" />
              </div>
              <span className="text-sm text-navy-500">Active</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-navy-900">{stats.activeConversations}</div>
              <div className="text-sm text-navy-600">Conversations</div>
              <div className="text-xs text-emerald-600">+12% this week</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-sm text-navy-500">Total</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-navy-900">${stats.totalEarnings}</div>
              <div className="text-sm text-navy-600">Earnings</div>
              <div className="text-xs text-emerald-600">+8% this month</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-navy-600" />
              </div>
              <span className="text-sm text-navy-500">Average</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-navy-900">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-navy-600">Rating</div>
              <div className="text-xs text-emerald-600">Excellent</div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-navy-500">Views</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-navy-900">{stats.profileViews}</div>
              <div className="text-sm text-navy-600">Profile Views</div>
              <div className="text-xs text-emerald-600">+15% this week</div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Recent Conversations</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {conversations.slice(0, 3).map((conversation) => (
              <div key={conversation._id} className="flex items-center space-x-3 p-3 hover:bg-navy-50 rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectedConversation(conversation)
                  setActiveTab('conversations')
                }}
              >
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy-900 truncate">
                    {conversation.title || 'Conversation'}
                  </p>
                  <p className="text-sm text-navy-600 truncate">
                    {conversation.lastMessage?.content.text || 'No messages yet'}
                  </p>
                </div>
                <span className="text-xs text-navy-500">
                  {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ''}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="h-20 flex-col space-y-2 bg-violet-600 hover:bg-violet-700"
              onClick={handleStartConversation}
            >
              <Plus className="w-6 h-6" />
              <span>New Chat</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => setActiveTab('profile')}
            >
              <Users className="w-6 h-6" />
              <span>Edit Profile</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
            >
              <Calendar className="w-6 h-6" />
              <span>Schedule</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col space-y-2"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-6 h-6" />
              <span>Settings</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderConversationsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?._id}
          currentUserId={currentUser._id!}
          onConversationSelect={setSelectedConversation}
          className="h-full"
        />
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        {selectedConversation ? (
          <Card className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-navy-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900">
                    {selectedConversation.title || 'Conversation'}
                  </h3>
                  <p className="text-sm text-navy-600">
                    {selectedConversation.participants.length} participants
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isFromCurrentUser={message.senderId === currentUser._id}
                  currentUserId={currentUser._id!}
                />
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-navy-100">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-violet-600 hover:bg-violet-700">
                  Send
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-navy-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-900 mb-2">No conversation selected</h3>
              <p className="text-navy-600">Choose a conversation to start messaging</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )

  const renderProfileTab = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <UserProfileCard
        user={currentUser}
        variant="detailed"
        showActions={false}
        className="w-full"
      />
      
      {/* Profile editing would go here */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Edit Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-navy-700 mb-2 block">First Name</label>
            <Input value={currentUser.firstName} />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 mb-2 block">Last Name</label>
            <Input value={currentUser.lastName} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-navy-700 mb-2 block">Bio</label>
            <Textarea value={currentUser.bio || ''} rows={4} />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button 
            onClick={() => setShowShareModal(true)}
            variant="outline" 
            className="text-violet-600 border-violet-200 hover:bg-violet-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700">
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderSettingsTab = () => (
    <Card className="max-w-4xl mx-auto p-6">
      <h3 className="text-lg font-semibold text-navy-900 mb-6">Settings</h3>
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-navy-900 mb-3">Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Email notifications</span>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Push notifications</span>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-navy-900 mb-3">Privacy</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Show online status</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-700">Allow direct messages</span>
              <input type="checkbox" className="toggle" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'conversations', name: 'Messages', icon: MessageCircle },
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 ${className}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.imageUrl || '/placeholder-user.jpg'}
              alt={formatUserName(currentUser.firstName, currentUser.lastName)}
              className="w-12 h-12 rounded-full ring-2 ring-violet-100"
            />
            <div>
              <h1 className="text-2xl font-bold text-navy-900">
                {formatUserName(currentUser.firstName, currentUser.lastName)}
              </h1>
              <p className="text-navy-600">Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm border border-navy-100">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'conversations' && renderConversationsTab()}
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
      
      {/* Profile Share Modal */}
      <ProfileShareModal
        user={currentUser}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  )
}
