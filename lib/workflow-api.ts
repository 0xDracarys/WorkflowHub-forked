import { Workflow, COLLECTIONS, ApiResponse } from './models'

export class WorkflowAPI {
  
  static async createWorkflow(workflowData: Omit<Workflow, '_id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating' | 'reviewCount'>): Promise<ApiResponse<Workflow>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const newWorkflow: Workflow = {
        ...workflowData,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        rating: 0,
        reviewCount: 0
      }

      const result = await collection.insertOne(newWorkflow)
      
      if (result.acknowledged) {
        const createdWorkflow = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdWorkflow!,
          message: 'Workflow created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create workflow'
        }
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getWorkflowsByUserId(userId: string, limit = 10, skip = 0): Promise<ApiResponse<Workflow[]>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const workflows = await collection
        .find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      return {
        success: true,
        data: workflows
      }
    } catch (error) {
      console.error('Error fetching user workflows:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getPublicWorkflows(category?: string, limit = 20, skip = 0): Promise<ApiResponse<Workflow[]>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const filter: any = { isPublic: true }
      if (category) {
        filter.category = category
      }

      const workflows = await collection
        .find(filter)
        .sort({ usageCount: -1, rating: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      return {
        success: true,
        data: workflows
      }
    } catch (error) {
      console.error('Error fetching public workflows:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getWorkflowById(workflowId: string): Promise<ApiResponse<Workflow>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const { ObjectId } = await import('mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const workflow = await collection.findOne({ _id: new ObjectId(workflowId) })
      
      if (workflow) {
        return {
          success: true,
          data: workflow
        }
      } else {
        return {
          success: false,
          error: 'Workflow not found'
        }
      }
    } catch (error) {
      console.error('Error fetching workflow:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateWorkflow(workflowId: string, userId: string, updateData: Partial<Workflow>): Promise<ApiResponse<Workflow>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const { ObjectId } = await import('mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      // Ensure user owns the workflow
      const existingWorkflow = await collection.findOne({ 
        _id: new ObjectId(workflowId), 
        userId 
      })

      if (!existingWorkflow) {
        return {
          success: false,
          error: 'Workflow not found or access denied'
        }
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(workflowId) },
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
          message: 'Workflow updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to update workflow'
        }
      }
    } catch (error) {
      console.error('Error updating workflow:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async deleteWorkflow(workflowId: string, userId: string): Promise<ApiResponse> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const { ObjectId } = await import('mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const result = await collection.deleteOne({ 
        _id: new ObjectId(workflowId), 
        userId 
      })

      if (result.deletedCount > 0) {
        return {
          success: true,
          message: 'Workflow deleted successfully'
        }
      } else {
        return {
          success: false,
          error: 'Workflow not found or access denied'
        }
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async incrementUsageCount(workflowId: string): Promise<ApiResponse> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const { ObjectId } = await import('mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const result = await collection.updateOne(
        { _id: new ObjectId(workflowId) },
        { $inc: { usageCount: 1 } }
      )

      if (result.modifiedCount > 0) {
        return {
          success: true,
          message: 'Usage count updated'
        }
      } else {
        return {
          success: false,
          error: 'Workflow not found'
        }
      }
    } catch (error) {
      console.error('Error updating usage count:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getWorkflowCategories(): Promise<ApiResponse<string[]>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const categories = await collection.distinct('category', { isPublic: true })

      return {
        success: true,
        data: categories.filter(Boolean) // Remove null/undefined values
      }
    } catch (error) {
      console.error('Error fetching workflow categories:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async searchWorkflows(query: string, category?: string, limit = 20): Promise<ApiResponse<Workflow[]>> {
    try {
      const { default: clientPromise } = await import('./mongodb')
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Workflow>(COLLECTIONS.WORKFLOWS)

      const searchFilter: any = {
        isPublic: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }

      if (category) {
        searchFilter.category = category
      }

      const workflows = await collection
        .find(searchFilter)
        .sort({ rating: -1, usageCount: -1 })
        .limit(limit)
        .toArray()

      return {
        success: true,
        data: workflows
      }
    } catch (error) {
      console.error('Error searching workflows:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }
}
