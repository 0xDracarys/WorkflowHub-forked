import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { WorkflowAPI } from '@/lib/workflow-api'

// GET /api/workflows/[id] - Get specific workflow
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    const resolvedParams = await params
    const workflowId = resolvedParams.id

    const result = await WorkflowAPI.getWorkflowById(workflowId)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    // Check if user has access to this workflow
    const workflow = result.data
    if (!workflow.isPublic && workflow.userId !== clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Increment usage count if viewing public workflow
    if (workflow.isPublic && workflow.userId !== clerkId) {
      await WorkflowAPI.incrementUsageCount(workflowId)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/workflows/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/[id] - Update specific workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const workflowId = resolvedParams.id
    const updateData = await request.json()

    const result = await WorkflowAPI.updateWorkflow(workflowId, clerkId, updateData)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('PUT /api/workflows/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows/[id] - Delete specific workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const resolvedParams = await params
    const workflowId = resolvedParams.id

    const result = await WorkflowAPI.deleteWorkflow(workflowId, clerkId)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('DELETE /api/workflows/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
