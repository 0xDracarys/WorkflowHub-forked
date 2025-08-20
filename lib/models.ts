import { ObjectId } from 'mongodb'

export enum COLLECTIONS {
  USERS = 'users',
  WORKFLOWS = 'workflows',
  CLIENTS = 'clients',
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface User {
  _id?: ObjectId
  clerkId: string
  email: string
  firstName?: string | null
  lastName?: string | null
  profileImageUrl?: string
  username?: string // Add username field
  googleTokens?: {
    accessToken: string
    refreshToken: string
    scope: string
    tokenType: string
    expiryDate: number
  }
  isProvider?: boolean
  providerProfile?: {
    bio?: string
    services?: {
      name: string
      description: string
      price: number
      duration: string
      features: string[]
      workflowId: string
    }[]
    socialLinks?: {
      platform: string
      url: string
    }[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface Workflow {
  _id?: ObjectId
  userId: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  isPublic: boolean
  steps: any[] // Define a more specific type if possible
  usageCount?: number
  rating?: number
  reviewCount?: number
  importedFrom?: string
  originalFileId?: string
  originalMimeType?: string
  originalEventId?: string
  recurrence?: any
  originalLabelId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  _id?: ObjectId
  userId: string
  name: string
  email: string
  workflowId: string
  status: 'new' | 'in_progress' | 'review' | 'completed'
  progress?: number
  currentStep?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
