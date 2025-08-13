// Extended user types for the workflowhub-user module
export interface UserProfile {
  _id?: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  username?: string
  imageUrl?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  createdAt: Date
  updatedAt: Date
  
  // User role and status
  userType: 'client' | 'influencer' | 'provider'
  isVerified: boolean
  isOnline: boolean
  lastActiveAt: Date
  
  // Influencer specific fields
  influencerProfile?: InfluencerProfile
  
  // Provider specific fields
  isProvider?: boolean
  providerProfile?: ProviderProfile
  
  // Preferences and settings
  preferences: UserPreferences
  privacySettings: PrivacySettings
}

export interface InfluencerProfile {
  displayName: string
  category: string[] // ["fashion", "lifestyle", "tech", "beauty", etc.]
  followerCount: {
    total: number
    platforms: {
      instagram?: number
      tiktok?: number
      youtube?: number
      twitter?: number
      linkedin?: number
    }
  }
  engagementRate: number
  contentStyle: string[]
  demographics: {
    ageRange: string
    genders: string[]
    topCountries: string[]
  }
  collaborationRates: {
    post: number
    story: number
    reel: number
    video: number
  }
  portfolio: InfluencerPortfolioItem[]
  rating: number
  reviewCount: number
  responseTime: number // in hours
  completionRate: number // percentage
}

export interface InfluencerPortfolioItem {
  id: string
  title: string
  description: string
  mediaUrls: string[]
  platform: string
  engagementStats: {
    views: number
    likes: number
    comments: number
    shares: number
  }
  campaignType: string
  completedAt: Date
  clientTestimonial?: string
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

export interface UserPreferences {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    showEmail: boolean
    showLocation: boolean
    showOnlineStatus: boolean
  }
  communication: {
    allowDirectMessages: boolean
    autoReply: boolean
    autoReplyMessage?: string
  }
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections'
  messagePermissions: 'everyone' | 'connections' | 'nobody'
  showActivity: boolean
  showStats: boolean
}

// User dashboard and analytics
export interface UserStats {
  totalConnections: number
  totalConversations: number
  activeConversations: number
  totalEarnings: number
  completedProjects: number
  averageRating: number
  responseTime: number
  profileViews: number
}

export interface UserActivity {
  id: string
  type: 'message' | 'project_update' | 'payment' | 'review' | 'connection'
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

// Search and filtering
export interface UserSearchFilters {
  userType?: 'client' | 'influencer' | 'provider'
  category?: string[]
  location?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  verified?: boolean
  availability?: boolean
}

export interface UserSearchResult {
  users: UserProfile[]
  total: number
  page: number
  limit: number
  filters: UserSearchFilters
}
