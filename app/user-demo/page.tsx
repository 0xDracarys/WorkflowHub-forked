'use client'

import React from 'react'
import { UserDashboard } from '../../workflowhub-user/components/UserDashboard'
import { UserProfile } from '../../workflowhub-user/types'

// Mock user data for demonstration
const mockCurrentUser: UserProfile = {
  _id: 'user_001',
  clerkId: 'clerk_12345',
  email: 'sarah.johnson@example.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  username: 'sarahjohnson',
  imageUrl: '/fashion-influencer.png',
  bio: 'Fashion & Lifestyle Content Creator | Helping brands connect with Gen-Z audience | 500K+ engaged followers',
  location: 'Los Angeles, CA',
  website: 'https://sarahjohnson.com',
  socialLinks: {
    instagram: 'https://instagram.com/sarahjohnson',
    twitter: 'https://twitter.com/sarahjohnson',
    youtube: 'https://youtube.com/@sarahjohnson'
  },
  createdAt: new Date('2023-01-15'),
  updatedAt: new Date('2024-12-15'),
  
  // User role and status
  userType: 'influencer',
  isVerified: true,
  isOnline: true,
  lastActiveAt: new Date(),
  
  // Influencer profile
  influencerProfile: {
    displayName: 'Sarah J | Fashion & Lifestyle',
    category: ['Fashion', 'Lifestyle', 'Beauty', 'Travel'],
    followerCount: {
      total: 523000,
      platforms: {
        instagram: 320000,
        tiktok: 150000,
        youtube: 45000,
        twitter: 8000
      }
    },
    engagementRate: 4.2,
    contentStyle: ['Professional Photography', 'Authentic Stories', 'Behind-the-Scenes'],
    demographics: {
      ageRange: '18-34',
      genders: ['Female 75%', 'Male 20%', 'Other 5%'],
      topCountries: ['United States', 'Canada', 'United Kingdom', 'Australia']
    },
    collaborationRates: {
      post: 2500,
      story: 800,
      reel: 3500,
      video: 5000
    },
    portfolio: [
      {
        id: 'port_001',
        title: 'Summer Fashion Collection 2024',
        description: 'Collaborated with premium fashion brand to showcase their summer collection through authentic lifestyle content.',
        mediaUrls: ['/placeholder.jpg'],
        platform: 'Instagram',
        engagementStats: {
          views: 125000,
          likes: 8500,
          comments: 320,
          shares: 150
        },
        campaignType: 'Brand Partnership',
        completedAt: new Date('2024-07-15'),
        clientTestimonial: 'Sarah delivered exceptional content that perfectly captured our brand aesthetic. Highly recommended!'
      },
      {
        id: 'port_002',
        title: 'Sustainable Beauty Campaign',
        description: 'Promoted eco-friendly skincare products through educational content and personal testimonials.',
        mediaUrls: ['/placeholder.jpg'],
        platform: 'TikTok',
        engagementStats: {
          views: 89000,
          likes: 12000,
          comments: 450,
          shares: 280
        },
        campaignType: 'Product Review',
        completedAt: new Date('2024-09-22')
      }
    ],
    rating: 4.9,
    reviewCount: 47,
    responseTime: 2, // hours
    completionRate: 98 // percentage
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true
    },
    privacy: {
      showEmail: false,
      showLocation: true,
      showOnlineStatus: true
    },
    communication: {
      allowDirectMessages: true,
      autoReply: false,
      autoReplyMessage: 'Thanks for reaching out! I typically respond within 2-4 hours during business days.'
    }
  },
  
  privacySettings: {
    profileVisibility: 'public',
    messagePermissions: 'everyone',
    showActivity: true,
    showStats: true
  }
}

export default function UserDemoPage() {
  return (
    <div className="min-h-screen">
      <UserDashboard 
        currentUser={mockCurrentUser}
        className="w-full"
      />
    </div>
  )
}
