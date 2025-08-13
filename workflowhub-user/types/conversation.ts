// Conversation and messaging types
export interface Conversation {
  _id?: string
  participants: Participant[]
  type: 'direct' | 'group' | 'project' | 'support'
  title?: string
  description?: string
  lastMessage?: Message
  unreadCount: { [userId: string]: number }
  createdAt: Date
  updatedAt: Date
  
  // Project-related conversation fields
  projectId?: string
  workflowId?: string
  milestoneId?: string
  
  // Status and metadata
  status: 'active' | 'archived' | 'blocked' | 'reported'
  tags?: string[]
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  
  // Settings
  settings: ConversationSettings
}

export interface Participant {
  userId: string
  role: 'client' | 'influencer' | 'provider' | 'admin' | 'moderator'
  joinedAt: Date
  permissions: ParticipantPermissions
  lastReadAt?: Date
  isActive: boolean
  nickname?: string
}

export interface ParticipantPermissions {
  canSendMessages: boolean
  canSendMedia: boolean
  canAddParticipants: boolean
  canRemoveParticipants: boolean
  canEditConversation: boolean
  canArchiveConversation: boolean
}

export interface Message {
  _id?: string
  conversationId: string
  senderId: string
  senderInfo: MessageSenderInfo
  type: MessageType
  content: MessageContent
  status: MessageStatus
  createdAt: Date
  updatedAt?: Date
  
  // Threading
  replyToId?: string
  threadId?: string
  
  // Reactions and interactions
  reactions: MessageReaction[]
  readBy: MessageReadStatus[]
  
  // Moderation
  isEdited: boolean
  isDeleted: boolean
  reportCount: number
}

export interface MessageSenderInfo {
  name: string
  avatar?: string
  userType: 'client' | 'influencer' | 'provider'
  isVerified: boolean
}

export type MessageType = 
  | 'text' 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'link' 
  | 'system' 
  | 'proposal' 
  | 'payment' 
  | 'milestone' 
  | 'review'
  | 'contract'
  | 'invoice'

export interface MessageContent {
  text?: string
  media?: MediaAttachment[]
  links?: LinkPreview[]
  
  // Special message content types
  proposal?: ProjectProposal
  payment?: PaymentInfo
  milestone?: MilestoneInfo
  review?: ReviewInfo
  contract?: ContractInfo
  invoice?: InvoiceInfo
  system?: SystemMessageInfo
}

export interface MediaAttachment {
  id: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  fileName: string
  fileSize: number
  mimeType: string
  thumbnail?: string
  duration?: number // for video/audio
  dimensions?: { width: number; height: number }
}

export interface LinkPreview {
  url: string
  title: string
  description: string
  image?: string
  siteName?: string
}

export interface ProjectProposal {
  title: string
  description: string
  deliverables: string[]
  timeline: string
  budget: number
  terms: string[]
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'negotiating'
}

export interface PaymentInfo {
  amount: number
  currency: string
  method: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  dueDate?: Date
}

export interface MilestoneInfo {
  title: string
  description: string
  dueDate: Date
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  payment?: number
}

export interface ReviewInfo {
  rating: number
  comment: string
  categories: {
    communication: number
    quality: number
    timeliness: number
    professionalism: number
  }
}

export interface ContractInfo {
  title: string
  terms: string[]
  startDate: Date
  endDate?: Date
  value: number
  status: 'draft' | 'pending' | 'active' | 'completed' | 'terminated'
}

export interface InvoiceInfo {
  invoiceNumber: string
  items: {
    description: string
    quantity: number
    rate: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  dueDate: Date
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
}

export interface SystemMessageInfo {
  type: 'user_joined' | 'user_left' | 'conversation_created' | 'milestone_completed' | 'payment_received' | 'project_started' | 'project_completed'
  data: Record<string, any>
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface MessageReaction {
  emoji: string
  users: string[]
  count: number
}

export interface MessageReadStatus {
  userId: string
  readAt: Date
}

export interface ConversationSettings {
  notifications: boolean
  autoArchive: boolean
  allowFileSharing: boolean
  allowLinkSharing: boolean
  messagingRestrictions: {
    maxFileSize: number
    allowedFileTypes: string[]
    maxMessageLength: number
  }
}

// Real-time messaging
export interface TypingStatus {
  conversationId: string
  userId: string
  isTyping: boolean
  timestamp: Date
}

export interface OnlineStatus {
  userId: string
  isOnline: boolean
  lastSeen?: Date
}

// Message templates and automation
export interface MessageTemplate {
  id: string
  title: string
  content: string
  category: string
  variables: string[]
  isActive: boolean
  usageCount: number
}

export interface AutoReply {
  id: string
  trigger: 'away' | 'busy' | 'after_hours' | 'keyword'
  condition: string
  response: string
  isActive: boolean
}

// Conversation analytics
export interface ConversationAnalytics {
  conversationId: string
  messageCount: number
  participantCount: number
  averageResponseTime: number
  engagementScore: number
  sentimentScore: number
  keywordFrequency: { [keyword: string]: number }
  timelineActivity: {
    date: string
    messageCount: number
  }[]
}

// Search and filtering
export interface ConversationSearchFilters {
  participants?: string[]
  type?: Conversation['type']
  status?: Conversation['status']
  hasUnread?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
  priority?: Conversation['priority']
}

export interface MessageSearchFilters {
  conversationId?: string
  senderId?: string
  type?: MessageType
  dateRange?: {
    start: Date
    end: Date
  }
  hasAttachments?: boolean
  content?: string
}
