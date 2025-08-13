// Export all types from the workflowhub-user module
export * from './user'
export * from './conversation'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
  page?: number
  limit?: number
}

// Common utility types
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DateRange {
  start: Date
  end: Date
}

export interface FileUpload {
  file: File
  progress: number
  status: 'idle' | 'uploading' | 'completed' | 'error'
  error?: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
}

export type NotificationType = 
  | 'message'
  | 'project_update'
  | 'payment'
  | 'review'
  | 'connection_request'
  | 'system'
  | 'promotion'
  | 'reminder'

// Error types
export interface UserError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

// Socket event types for real-time features
export interface SocketEvents {
  // Conversation events
  'conversation:join': { conversationId: string }
  'conversation:leave': { conversationId: string }
  'conversation:typing': { conversationId: string; userId: string; isTyping: boolean }
  'conversation:message': { conversationId: string; message: Message }
  'conversation:read': { conversationId: string; messageId: string; userId: string }
  
  // User events
  'user:online': { userId: string }
  'user:offline': { userId: string }
  'user:status_change': { userId: string; status: string }
  
  // Notification events
  'notification:new': { notification: Notification }
  'notification:read': { notificationId: string }
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface UserComponentProps extends BaseComponentProps {
  user: UserProfile
}

export interface ConversationComponentProps extends BaseComponentProps {
  conversation: Conversation
}
