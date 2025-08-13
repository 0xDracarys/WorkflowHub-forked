// Export all API functions from the workflowhub-user module
export * from './user-api'
export * from './conversation-api'

// Utility functions
export const formatUserName = (firstName: string, lastName: string, username?: string) => {
  if (username) return `@${username}`
  return `${firstName} ${lastName}`.trim()
}

export const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}

export const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

export const isImageFile = (mimeType: string) => {
  return mimeType.startsWith('image/')
}

export const isVideoFile = (mimeType: string) => {
  return mimeType.startsWith('video/')
}

export const isAudioFile = (mimeType: string) => {
  return mimeType.startsWith('audio/')
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const generateConversationTitle = (participants: { firstName: string, lastName: string }[]) => {
  if (participants.length === 2) {
    return `${participants[0].firstName} ${participants[0].lastName} & ${participants[1].firstName} ${participants[1].lastName}`
  }
  if (participants.length > 2) {
    return `${participants[0].firstName} ${participants[0].lastName} & ${participants.length - 1} others`
  }
  return 'New Conversation'
}

// Constants
export const USER_TYPES = {
  CLIENT: 'client' as const,
  INFLUENCER: 'influencer' as const,
  PROVIDER: 'provider' as const
}

export const MESSAGE_TYPES = {
  TEXT: 'text' as const,
  IMAGE: 'image' as const,
  VIDEO: 'video' as const,
  AUDIO: 'audio' as const,
  FILE: 'file' as const,
  PROPOSAL: 'proposal' as const,
  PAYMENT: 'payment' as const,
  SYSTEM: 'system' as const
}

export const CONVERSATION_TYPES = {
  DIRECT: 'direct' as const,
  GROUP: 'group' as const,
  PROJECT: 'project' as const,
  SUPPORT: 'support' as const
}

export const CONVERSATION_STATUS = {
  ACTIVE: 'active' as const,
  ARCHIVED: 'archived' as const,
  BLOCKED: 'blocked' as const,
  REPORTED: 'reported' as const
}

// Error messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  MESSAGE_NOT_FOUND: 'Message not found',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_INPUT: 'Invalid input provided',
  SERVER_ERROR: 'Internal server error',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type'
}

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User profile created successfully',
  USER_UPDATED: 'User profile updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
  CONVERSATION_CREATED: 'Conversation created successfully',
  FILE_UPLOADED: 'File uploaded successfully'
}
