import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ClientAPI } from '@/lib/client-api'

// GET /api/clients - Get clients for current user
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'new' | 'in_progress' | 'review' | 'completed' | 'cancelled' | null
    const workflowId = searchParams.get('workflowId')
    const type = searchParams.get('type') // 'pipeline', 'stats', etc.
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    let result

    if (type === 'stats') {
      // Get pipeline statistics
      result = await ClientAPI.getPipelineStats(clerkId)
    } else if (workflowId) {
      // Get clients for specific workflow
      result = await ClientAPI.getClientsByWorkflowId(workflowId, limit, skip)
    } else {
      // Get clients by provider ID (current user)
      result = await ClientAPI.getClientsByProviderId(clerkId, status || undefined, limit, skip)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/clients error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const clientData = await request.json()
    
    // Ensure providerId matches authenticated user
    clientData.providerId = clerkId

    const result = await ClientAPI.createClient(clientData)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST /api/clients error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/clients - Update client status
export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { clientId, status, progress } = await request.json()
    
    if (!clientId || !status) {
      return NextResponse.json(
        { success: false, error: 'Client ID and status are required' },
        { status: 400 }
      )
    }

    const result = await ClientAPI.updateClientStatus(clientId, status, progress)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('PUT /api/clients error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
