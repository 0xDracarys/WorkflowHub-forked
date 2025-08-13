'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  MapPin, 
  Star, 
  MessageCircle, 
  Heart, 
  Share2, 
  CheckCircle,
  Globe,
  Users,
  TrendingUp
} from 'lucide-react'
import { UserProfile } from '../types'
import { formatUserName, formatTime } from '../lib'

interface UserProfileCardProps {
  user: UserProfile
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onMessage?: () => void
  onFollow?: () => void
  onShare?: () => void
  className?: string
}

export function UserProfileCard({
  user,
  variant = 'default',
  showActions = true,
  onMessage,
  onFollow,
  onShare,
  className = ''
}: UserProfileCardProps) {
  const displayName = formatUserName(user.firstName, user.lastName, user.username)
  
  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'influencer':
        return 'bg-violet-100 text-violet-800 border-violet-200'
      case 'provider':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'client':
        return 'bg-navy-100 text-navy-800 border-navy-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getOnlineStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-emerald-500' : 'bg-gray-300'
  }

  if (variant === 'compact') {
    return (
      <Card className={`p-4 hover:shadow-lg transition-shadow ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={user.imageUrl || '/placeholder-user.jpg'}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getOnlineStatusColor(user.isOnline)} rounded-full border-2 border-white`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-navy-900 truncate">{displayName}</h3>
              {user.isVerified && (
                <CheckCircle className="w-4 h-4 text-violet-600 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-navy-600 truncate">
              {user.userType === 'influencer' && user.influencerProfile?.displayName}
              {user.userType === 'provider' && user.providerProfile?.businessName}
              {user.userType === 'client' && user.bio}
            </p>
            <Badge className={`text-xs ${getUserTypeColor(user.userType)}`}>
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </Badge>
          </div>
          
          {showActions && (
            <Button size="sm" onClick={onMessage} className="bg-violet-600 hover:bg-violet-700">
              <MessageCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.imageUrl || '/placeholder-user.jpg'}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-100"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${getOnlineStatusColor(user.isOnline)} rounded-full border-2 border-white`} />
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h2 className="text-xl font-bold text-navy-900">{displayName}</h2>
              {user.isVerified && (
                <CheckCircle className="w-5 h-5 text-violet-600" />
              )}
            </div>
            
            <div className="flex items-center space-x-3 mb-2">
              <Badge className={`${getUserTypeColor(user.userType)}`}>
                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
              </Badge>
              
              {user.location && (
                <div className="flex items-center text-sm text-navy-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </div>
              )}
            </div>
            
            <p className="text-sm text-navy-500">
              {user.isOnline ? 'Online now' : `Last seen ${formatTime(user.lastActiveAt)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Bio/Description */}
      {user.bio && (
        <p className="text-navy-700 mb-4 line-clamp-3">{user.bio}</p>
      )}

      {/* Influencer Stats */}
      {user.userType === 'influencer' && user.influencerProfile && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="font-bold text-navy-900">
                {user.influencerProfile.followerCount.total.toLocaleString()}
              </div>
              <div className="text-xs text-navy-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-navy-900">
                {user.influencerProfile.engagementRate.toFixed(1)}%
              </div>
              <div className="text-xs text-navy-600">Engagement</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-navy-900">
                  {user.influencerProfile.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-navy-600">Rating</div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {user.influencerProfile.category.slice(0, 3).map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className="text-xs bg-violet-50 text-violet-700 border-violet-200"
              >
                {category}
              </Badge>
            ))}
            {user.influencerProfile.category.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.influencerProfile.category.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Provider Stats */}
      {user.userType === 'provider' && user.providerProfile && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="font-bold text-navy-900">
                ${user.providerProfile.hourlyRate}/hr
              </div>
              <div className="text-xs text-navy-600">Rate</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-bold text-navy-900">
                  {user.providerProfile.rating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-navy-600">Rating</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-navy-900">
                {user.providerProfile.reviewCount}
              </div>
              <div className="text-xs text-navy-600">Reviews</div>
            </div>
          </div>
          
          {/* Specialties */}
          <div className="flex flex-wrap gap-1">
            {user.providerProfile.specialties.slice(0, 3).map((specialty) => (
              <Badge 
                key={specialty}
                variant="outline"
                className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                {specialty}
              </Badge>
            ))}
            {user.providerProfile.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.providerProfile.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Social Links */}
      {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
        <div className="flex items-center space-x-2 mb-4">
          {user.website && (
            <Button variant="outline" size="sm">
              <Globe className="w-4 h-4" />
            </Button>
          )}
          {Object.entries(user.socialLinks).map(([platform, url]) => (
            url && (
              <Button key={platform} variant="outline" size="sm">
                <Users className="w-4 h-4" />
              </Button>
            )
          ))}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onMessage}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onFollow}
            className="text-violet-600 border-violet-200 hover:bg-violet-50"
          >
            <Heart className="w-4 h-4 mr-2" />
            Follow
          </Button>
          
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  )
}
