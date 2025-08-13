// Mock data for demo purposes - simulates API responses
import { UserStats, UserActivity, Conversation, Message } from '../types'

export const mockUserStats: UserStats = {
  totalConnections: 145,
  totalConversations: 23,
  activeConversations: 8,
  totalEarnings: 47200,
  completedProjects: 34,
  averageRating: 4.9,
  responseTime: 2.3, // hours
  profileViews: 1247
}

export const mockUserActivity: UserActivity[] = [
  {
    id: 'activity_001',
    type: 'message',
    title: 'New message from Alex Rodriguez',
    description: 'Sent a project proposal for VIP Coaching Program',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: '/user-demo'
  },
  {
    id: 'activity_002',
    type: 'project_update',
    title: 'Project milestone completed',
    description: 'Maya Patel approved the Brand Audit deliverables',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    actionUrl: '/user-demo'
  },
  {
    id: 'activity_003',
    type: 'payment',
    title: 'Payment received',
    description: '$2,500 payment from Fashion Brand XYZ',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: '/user-demo'
  }
]

export const mockConversations: Conversation[] = [
  {
    _id: 'conv_001',
    participants: [
      {
        userId: 'user_001', // current user
        role: 'influencer',
        joinedAt: new Date('2024-12-01'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'Sarah Johnson'
      },
      {
        userId: 'user_002',
        role: 'client',
        joinedAt: new Date('2024-12-01'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'Alex Rodriguez'
      }
    ],
    type: 'direct',
    title: 'Alex Rodriguez',
    lastMessage: {
      _id: 'msg_001',
      conversationId: 'conv_001',
      senderId: 'user_002',
      senderInfo: {
        name: 'Alex Rodriguez',
        avatar: '/client-avatar-1.png',
        userType: 'client',
        isVerified: true
      },
      type: 'proposal',
      content: {
        text: 'I'd love to discuss a collaboration opportunity with you!',
        proposal: {
          title: 'Summer Fashion Campaign 2025',
          description: 'Looking for an influencer to promote our new summer collection',
          deliverables: ['3 Instagram posts', '5 Stories', '1 Reel'],
          timeline: '2 weeks',
          budget: 3500,
          terms: ['Usage rights for 6 months', 'Exclude direct competitors'],
          status: 'sent'
        }
      },
      status: 'delivered',
      reactions: [],
      readBy: [
        {
          userId: 'user_002',
          readAt: new Date()
        }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
    unreadCount: { 'user_001': 1, 'user_002': 0 },
    status: 'active',
    priority: 'high',
    tags: ['collaboration', 'fashion'],
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
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date()
  },
  {
    _id: 'conv_002',
    participants: [
      {
        userId: 'user_001',
        role: 'influencer',
        joinedAt: new Date('2024-11-20'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'Sarah Johnson'
      },
      {
        userId: 'user_003',
        role: 'provider',
        joinedAt: new Date('2024-11-20'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'Maya Patel'
      }
    ],
    type: 'project',
    title: 'Brand Strategy Project',
    lastMessage: {
      _id: 'msg_002',
      conversationId: 'conv_002',
      senderId: 'user_003',
      senderInfo: {
        name: 'Maya Patel',
        avatar: '/client-avatar-2.png',
        userType: 'provider',
        isVerified: true
      },
      type: 'text',
      content: {
        text: 'The final report has been uploaded to the shared folder. Please review and let me know your thoughts!'
      },
      status: 'read',
      reactions: [
        {
          emoji: '👍',
          users: ['user_001'],
          count: 1
        }
      ],
      readBy: [
        {
          userId: 'user_003',
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
        },
        {
          userId: 'user_001',
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
    },
    unreadCount: { 'user_001': 0, 'user_003': 0 },
    status: 'active',
    priority: 'medium',
    tags: ['project', 'strategy'],
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
    },
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    _id: 'conv_003',
    participants: [
      {
        userId: 'user_001',
        role: 'influencer',
        joinedAt: new Date('2024-12-10'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'Sarah Johnson'
      },
      {
        userId: 'user_004',
        role: 'client',
        joinedAt: new Date('2024-12-10'),
        permissions: {
          canSendMessages: true,
          canSendMedia: true,
          canAddParticipants: false,
          canRemoveParticipants: false,
          canEditConversation: false,
          canArchiveConversation: true
        },
        isActive: true,
        nickname: 'David Chen'
      }
    ],
    type: 'direct',
    title: 'David Chen',
    lastMessage: {
      _id: 'msg_003',
      conversationId: 'conv_003',
      senderId: 'user_001',
      senderInfo: {
        name: 'Sarah Johnson',
        avatar: '/fashion-influencer.png',
        userType: 'influencer',
        isVerified: true
      },
      type: 'text',
      content: {
        text: 'Absolutely! I'd be happy to create content for your brand. Let me know more details about your vision.'
      },
      status: 'delivered',
      reactions: [],
      readBy: [
        {
          userId: 'user_001',
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
    },
    unreadCount: { 'user_001': 0, 'user_004': 1 },
    status: 'active',
    priority: 'low',
    tags: ['new-inquiry'],
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
    },
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
  }
]

export const mockMessages: { [conversationId: string]: Message[] } = {
  'conv_001': [
    {
      _id: 'msg_001_1',
      conversationId: 'conv_001',
      senderId: 'user_002',
      senderInfo: {
        name: 'Alex Rodriguez',
        avatar: '/client-avatar-1.png',
        userType: 'client',
        isVerified: true
      },
      type: 'text',
      content: {
        text: 'Hi Sarah! I've been following your content and I'm really impressed with your aesthetic and engagement.'
      },
      status: 'read',
      reactions: [],
      readBy: [
        { userId: 'user_002', readAt: new Date(Date.now() - 1000 * 60 * 60) },
        { userId: 'user_001', readAt: new Date(Date.now() - 1000 * 60 * 45) }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },
    {
      _id: 'msg_001_2',
      conversationId: 'conv_001',
      senderId: 'user_001',
      senderInfo: {
        name: 'Sarah Johnson',
        avatar: '/fashion-influencer.png',
        userType: 'influencer',
        isVerified: true
      },
      type: 'text',
      content: {
        text: 'Thank you so much! That means a lot. I'd love to hear more about what you have in mind.'
      },
      status: 'read',
      reactions: [
        {
          emoji: '💕',
          users: ['user_002'],
          count: 1
        }
      ],
      readBy: [
        { userId: 'user_001', readAt: new Date(Date.now() - 1000 * 60 * 50) },
        { userId: 'user_002', readAt: new Date(Date.now() - 1000 * 60 * 30) }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 50) // 50 minutes ago
    },
    // The proposal message (from mockConversations)
    {
      _id: 'msg_001',
      conversationId: 'conv_001',
      senderId: 'user_002',
      senderInfo: {
        name: 'Alex Rodriguez',
        avatar: '/client-avatar-1.png',
        userType: 'client',
        isVerified: true
      },
      type: 'proposal',
      content: {
        text: 'Here's a detailed proposal for our collaboration:',
        proposal: {
          title: 'Summer Fashion Campaign 2025',
          description: 'Looking for an influencer to promote our new summer collection through authentic lifestyle content. We love your aesthetic and think you'd be perfect for showcasing our pieces.',
          deliverables: ['3 Instagram posts', '5 Stories', '1 Reel', 'Usage rights for 6 months'],
          timeline: '2 weeks from approval',
          budget: 3500,
          terms: ['Usage rights for 6 months', 'Exclude direct competitors for 3 months', 'Content approval process within 48 hours'],
          status: 'sent'
        }
      },
      status: 'delivered',
      reactions: [],
      readBy: [
        {
          userId: 'user_002',
          readAt: new Date(Date.now() - 1000 * 60 * 15)
        }
      ],
      isEdited: false,
      isDeleted: false,
      reportCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    }
  ]
}
