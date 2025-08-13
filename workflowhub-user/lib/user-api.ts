import clientPromise from '../../lib/mongodb'
import { 
  UserProfile, 
  UserStats, 
  UserActivity, 
  UserSearchFilters, 
  UserSearchResult,
  ApiResponse,
  PaginationParams
} from '../types'

export class WorkflowHubUserAPI {
  private static readonly COLLECTION_NAME = 'workflowhub_users'

  // User Profile Operations
  static async createUserProfile(userData: Omit<UserProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      // Check if user already exists
      const existingUser = await collection.findOne({ clerkId: userData.clerkId })
      if (existingUser) {
        return {
          success: false,
          error: 'User profile already exists'
        }
      }

      const newUser: UserProfile = {
        ...userData,
        isVerified: false,
        isOnline: false,
        lastActiveAt: new Date(),
        preferences: userData.preferences || {
          notifications: {
            email: true,
            push: true,
            sms: false,
            marketing: false
          },
          privacy: {
            showEmail: false,
            showLocation: true,
            showOnlineStatus: true
          },
          communication: {
            allowDirectMessages: true,
            autoReply: false
          }
        },
        privacySettings: userData.privacySettings || {
          profileVisibility: 'public',
          messagePermissions: 'everyone',
          showActivity: true,
          showStats: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(newUser)
      
      if (result.acknowledged) {
        const createdUser = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdUser!,
          message: 'User profile created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create user profile'
        }
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const user = await collection.findOne({ $or: [{ _id: userId }, { clerkId: userId }] })
      
      if (user) {
        return {
          success: true,
          data: user
        }
      } else {
        return {
          success: false,
          error: 'User profile not found'
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateUserProfile(userId: string, updateData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const result = await collection.findOneAndUpdate(
        { $or: [{ _id: userId }, { clerkId: userId }] },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'User profile updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'User profile not found'
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateUserStatus(userId: string, isOnline: boolean): Promise<ApiResponse<void>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      await collection.updateOne(
        { $or: [{ _id: userId }, { clerkId: userId }] },
        { 
          $set: { 
            isOnline,
            lastActiveAt: new Date(),
            updatedAt: new Date()
          } 
        }
      )

      return {
        success: true,
        message: 'User status updated successfully'
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Search and Discovery
  static async searchUsers(filters: UserSearchFilters, pagination: PaginationParams = {}): Promise<ApiResponse<UserSearchResult>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination
      const skip = (page - 1) * limit

      // Build query based on filters
      const query: any = {}
      
      if (filters.userType) {
        query.userType = filters.userType
      }
      
      if (filters.category && filters.category.length > 0) {
        query.$or = [
          { 'influencerProfile.category': { $in: filters.category } },
          { 'providerProfile.specialties': { $in: filters.category } }
        ]
      }
      
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' }
      }
      
      if (filters.verified !== undefined) {
        query.isVerified = filters.verified
      }
      
      if (filters.availability !== undefined) {
        query.isOnline = filters.availability
      }
      
      if (filters.rating) {
        query.$or = [
          { 'influencerProfile.rating': { $gte: filters.rating } },
          { 'providerProfile.rating': { $gte: filters.rating } }
        ]
      }

      if (filters.priceRange) {
        query.$or = [
          { 
            'influencerProfile.collaborationRates.post': { 
              $gte: filters.priceRange.min, 
              $lte: filters.priceRange.max 
            } 
          },
          { 
            'providerProfile.hourlyRate': { 
              $gte: filters.priceRange.min, 
              $lte: filters.priceRange.max 
            } 
          }
        ]
      }

      // Execute search
      const users = await collection
        .find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .toArray()

      const total = await collection.countDocuments(query)

      return {
        success: true,
        data: {
          users,
          total,
          page,
          limit,
          filters
        }
      }
    } catch (error) {
      console.error('Error searching users:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getFeaturedInfluencers(limit: number = 10): Promise<ApiResponse<UserProfile[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const influencers = await collection
        .find({ 
          userType: 'influencer',
          isVerified: true,
          'influencerProfile.rating': { $gte: 4.5 }
        })
        .sort({ 'influencerProfile.followerCount.total': -1 })
        .limit(limit)
        .toArray()

      return {
        success: true,
        data: influencers
      }
    } catch (error) {
      console.error('Error fetching featured influencers:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // User Statistics
  static async getUserStats(userId: string): Promise<ApiResponse<UserStats>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      
      // This would typically aggregate data from multiple collections
      // For now, returning mock data structure
      const stats: UserStats = {
        totalConnections: 0,
        totalConversations: 0,
        activeConversations: 0,
        totalEarnings: 0,
        completedProjects: 0,
        averageRating: 0,
        responseTime: 0,
        profileViews: 0
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // User Activity
  static async getUserActivity(userId: string, limit: number = 20): Promise<ApiResponse<UserActivity[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      
      // This would typically fetch from an activities collection
      // For now, returning empty array
      const activities: UserActivity[] = []

      return {
        success: true,
        data: activities
      }
    } catch (error) {
      console.error('Error fetching user activity:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Verification
  static async verifyUser(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const result = await collection.findOneAndUpdate(
        { $or: [{ _id: userId }, { clerkId: userId }] },
        { 
          $set: { 
            isVerified: true,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'User verified successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error verifying user:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Influencer specific operations
  static async updateInfluencerProfile(userId: string, profileData: UserProfile['influencerProfile']): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const result = await collection.findOneAndUpdate(
        { $or: [{ _id: userId }, { clerkId: userId }] },
        { 
          $set: { 
            userType: 'influencer',
            influencerProfile: profileData,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Influencer profile updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error updating influencer profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  // Provider specific operations
  static async updateProviderProfile(userId: string, profileData: UserProfile['providerProfile']): Promise<ApiResponse<UserProfile>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const result = await collection.findOneAndUpdate(
        { $or: [{ _id: userId }, { clerkId: userId }] },
        { 
          $set: { 
            userType: 'provider',
            isProvider: true,
            providerProfile: profileData,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Provider profile updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error updating provider profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async deleteUserProfile(userId: string): Promise<ApiResponse<void>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<UserProfile>(this.COLLECTION_NAME)

      const result = await collection.deleteOne({ $or: [{ _id: userId }, { clerkId: userId }] })

      if (result.deletedCount > 0) {
        return {
          success: true,
          message: 'User profile deleted successfully'
        }
      } else {
        return {
          success: false,
          error: 'User profile not found'
        }
      }
    } catch (error) {
      console.error('Error deleting user profile:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }
}
