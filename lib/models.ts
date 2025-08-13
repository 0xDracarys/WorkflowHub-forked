// User related interfaces
export interface User {
  _id?: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  username?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
  
  // Provider-specific fields
  isProvider?: boolean
  providerProfile?: ProviderProfile
  
  // Google integration
  googleTokens?: {
    accessToken: string
    refreshToken: string
    scope: string
    tokenType: string
    expiryDate: number
  }
}

export interface ProviderProfile {
  businessName: string
  description: string
  specialties: string[]
  hourlyRate: number
  availability: string
  portfolio: PortfolioItem[]
  rating: number
  reviewCount: number
  verified: boolean
}

export interface PortfolioItem {
  title: string
  description: string
  imageUrl: string
  tags: string[]
  completedAt: Date
}

// Workflow related interfaces
export interface Workflow {
  _id?: string
  userId: string
  title: string
  description: string
  steps: WorkflowStep[]
  tags: string[]
  isPublic: boolean
  category: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
  rating: number
  reviewCount: number
}

export interface WorkflowStep {
  id: string
  title: string
  description: string
  type: 'action' | 'condition' | 'loop' | 'delay' | 'integration'
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

// Service/Booking related interfaces
export interface Service {
  _id?: string
  providerId: string
  title: string
  description: string
  category: string
  subcategory: string
  price: {
    type: 'fixed' | 'hourly' | 'package'
    amount: number
    currency: 'USD'
  }
  deliveryTime: number // in days
  features: string[]
  requirements: string[]
  tags: string[]
  images: string[]
  rating: number
  reviewCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  _id?: string
  serviceId: string
  clientId: string
  providerId: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
  requirements: string
  budget: number
  deadline: Date
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  attachments?: string[]
}

// Review and Rating interfaces
export interface Review {
  _id?: string
  bookingId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: Date
}

// Client and Pipeline Management interfaces
export interface Client {
  _id?: string
  workflowId: string
  providerId: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: 'new' | 'in_progress' | 'review' | 'completed' | 'cancelled'
  progress: number
  currentStep: string
  formData: Record<string, any>
  communications: ClientCommunication[]
  createdAt: Date
  updatedAt: Date
}

export interface ClientCommunication {
  id: string
  type: 'email' | 'sms' | 'call' | 'meeting' | 'document'
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read' | 'responded'
}

export interface WorkflowExecution {
  _id?: string
  workflowId: string
  clientId: string
  providerId: string
  status: 'active' | 'paused' | 'completed' | 'failed'
  currentStep: number
  completedSteps: string[]
  stepData: Record<string, any>
  startedAt: Date
  completedAt?: Date
  updatedAt: Date
}

// Google Integration interfaces
export interface GoogleIntegration {
  _id?: string
  userId: string
  connectedServices: {
    calendar: boolean
    drive: boolean
    gmail: boolean
    sheets: boolean
    docs: boolean
  }
  permissions: string[]
  lastSyncAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Database collection names
export const COLLECTIONS = {
  USERS: 'users',
  WORKFLOWS: 'workflows',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  CLIENTS: 'clients',
  WORKFLOW_EXECUTIONS: 'workflow_executions',
  GOOGLE_INTEGRATIONS: 'google_integrations'
} as const
