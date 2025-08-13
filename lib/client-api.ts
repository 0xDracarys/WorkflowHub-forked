import clientPromise from './mongodb'
import { Client, WorkflowExecution, COLLECTIONS, ApiResponse } from './models'
import { ObjectId } from 'mongodb'

export class ClientAPI {
  
  static async createClient(clientData: Omit<Client, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

      const newClient: Client = {
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(newClient)
      
      if (result.acknowledged) {
        const createdClient = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdClient!,
          message: 'Client created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create client'
        }
      }
    } catch (error) {
      console.error('Error creating client:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getClientsByProviderId(providerId: string, status?: Client['status'], limit = 20, skip = 0): Promise<ApiResponse<Client[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

      const filter: any = { providerId }
      if (status) {
        filter.status = status
      }

      const clients = await collection
        .find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      return {
        success: true,
        data: clients
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getClientsByWorkflowId(workflowId: string, limit = 20, skip = 0): Promise<ApiResponse<Client[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

      const clients = await collection
        .find({ workflowId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray()

      return {
        success: true,
        data: clients
      }
    } catch (error) {
      console.error('Error fetching clients by workflow:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateClientStatus(clientId: string, status: Client['status'], progress?: number): Promise<ApiResponse<Client>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

      const updateData: any = { 
        status, 
        updatedAt: new Date() 
      }
      
      if (progress !== undefined) {
        updateData.progress = progress
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(clientId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

      if (result) {
        return {
          success: true,
          data: result,
          message: 'Client status updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'Client not found'
        }
      }
    } catch (error) {
      console.error('Error updating client status:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async getPipelineStats(providerId: string): Promise<ApiResponse<{ stage: string; count: number; revenue: number }[]>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<Client>(COLLECTIONS.CLIENTS)

      const pipeline = [
        { $match: { providerId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            // For revenue calculation, we'd need payment/pricing data
            revenue: { $sum: 0 } // Placeholder - would need actual payment integration
          }
        },
        {
          $project: {
            stage: '$_id',
            count: 1,
            revenue: 1,
            _id: 0
          }
        }
      ]

      const stats = await collection.aggregate(pipeline).toArray()
      
      // Map status to user-friendly stage names
      const stageMap = {
        'new': 'New Applications',
        'in_progress': 'In Progress',
        'review': 'Review & Approval',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      }

      const formattedStats = stats.map(stat => ({
        stage: stageMap[stat.stage as keyof typeof stageMap] || stat.stage,
        count: stat.count,
        revenue: stat.revenue
      }))

      return {
        success: true,
        data: formattedStats
      }
    } catch (error) {
      console.error('Error fetching pipeline stats:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async createWorkflowExecution(executionData: Omit<WorkflowExecution, '_id' | 'startedAt' | 'updatedAt'>): Promise<ApiResponse<WorkflowExecution>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<WorkflowExecution>(COLLECTIONS.WORKFLOW_EXECUTIONS)

      const newExecution: WorkflowExecution = {
        ...executionData,
        startedAt: new Date(),
        updatedAt: new Date()
      }

      const result = await collection.insertOne(newExecution)
      
      if (result.acknowledged) {
        const createdExecution = await collection.findOne({ _id: result.insertedId })
        return {
          success: true,
          data: createdExecution!,
          message: 'Workflow execution created successfully'
        }
      } else {
        return {
          success: false,
          error: 'Failed to create workflow execution'
        }
      }
    } catch (error) {
      console.error('Error creating workflow execution:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }

  static async updateWorkflowExecution(executionId: string, updateData: Partial<WorkflowExecution>): Promise<ApiResponse<WorkflowExecution>> {
    try {
      const client = await clientPromise
      const db = client.db('workflowhub')
      const collection = db.collection<WorkflowExecution>(COLLECTIONS.WORKFLOW_EXECUTIONS)

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(executionId) },
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
          message: 'Workflow execution updated successfully'
        }
      } else {
        return {
          success: false,
          error: 'Workflow execution not found'
        }
      }
    } catch (error) {
      console.error('Error updating workflow execution:', error)
      return {
        success: false,
        error: 'Internal server error'
      }
    }
  }
}
