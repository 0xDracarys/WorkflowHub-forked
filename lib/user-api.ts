import clientPromise from './mongodb'
import { User, COLLECTIONS, ApiResponse } from './models'

export class UserAPI {
  
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      // Check if user already exists
      const existingUser = await collection.findOne({ clerkId: userData.clerkId })
      if (existingUser) {
        return {
          success: false,
          error: 'User already exists'
        }
      }

      const newUser: User = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(newUser)
      
      if (result.acknowledged) {
        const createdUser = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdUser!,
          message: 'User created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create user'
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getUserByClerkId(clerkId: string): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const user = await collection.findOne({ clerkId })
      
      if (user) {
        return {
          success: true,
          data: user
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error fetching user by clerk ID:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const user = await collection.findOne({ _id: userId })
      
      if (user) {
        return {
          success: true,
          data: user
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const user = await collection.findOne({ username })
      
      if (user) {
        return {
          success: true,
          data: user
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error fetching user by username:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateUser(clerkId: string, updateData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const result = await collection.findOneAndUpdate(
        { clerkId },
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
          message: 'User updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateGoogleTokens(clerkId: string, tokens: User['googleTokens']): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const result = await collection.findOneAndUpdate(
        { clerkId },
        { 
          $set: { 
            googleTokens: tokens,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Google tokens updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error updating Google tokens:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async makeProvider(clerkId: string, providerData: User['providerProfile']): Promise<ApiResponse<User>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const result = await collection.findOneAndUpdate(
        { clerkId },
        { 
          $set: { 
            isProvider: true,
            providerProfile: providerData,
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'User updated to provider successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error making user a provider:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getProviders(limit = 10, skip = 0): Promise<ApiResponse<User[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const providers = await collection
        .find({ isProvider: true })
        .limit(limit)
        .skip(skip)
        .toArray()

      return {
        success: true,
        data: providers
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async deleteUser(clerkId: string): Promise<ApiResponse> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<User>(COLLECTIONS.USERS)

      const result = await collection.deleteOne({ clerkId })

      if (result.deletedCount > 0) {
        return {
          success: true,
          message: 'User deleted successfully'
        }
      } else {
        return {
          success: false,
          error: 'User not found'
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }
}
