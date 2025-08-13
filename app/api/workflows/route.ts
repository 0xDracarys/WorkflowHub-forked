import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { WorkflowAPI } from '@/lib/workflow-api'

// GET /api/workflows - Get workflows
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'public'
    const category = searchParams.get('category')
    const query = searchParams.get('query')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    let result

    if (type === 'user' && clerkId) {
      // Get user's workflows
      result = await WorkflowAPI.getWorkflowsByUserId(clerkId, limit, skip)
    } else if (type === 'search' && query) {
      // Search workflows
      result = await WorkflowAPI.searchWorkflows(query, category || undefined, limit)
    } else if (type === 'categories') {
      // Get categories
      result = await WorkflowAPI.getWorkflowCategories()
    } else {
      // Get public workflows
      result = await WorkflowAPI.getPublicWorkflows(category || undefined, limit, skip)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/workflows error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workflowData = await request.json()
    
    // Ensure userId matches authenticated user
    workflowData.userId = clerkId

    const result = await WorkflowAPI.createWorkflow(workflowData)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('POST /api/workflows error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows - Update workflow
export async function PUT(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { workflowId, ...updateData } = await request.json()
    
    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const result = await WorkflowAPI.updateWorkflow(workflowId, clerkId, updateData)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('PUT /api/workflows error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows - Delete workflow
export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { workflowId } = await request.json()
    
    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const result = await WorkflowAPI.deleteWorkflow(workflowId, clerkId)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE /api/workflows error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
