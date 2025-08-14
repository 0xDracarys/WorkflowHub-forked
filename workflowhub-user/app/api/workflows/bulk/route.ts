import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { WorkflowAPI } from '@/lib/workflow-api'

// POST /api/workflows/bulk - Bulk workflow operations
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, workflowIds, filters } = await request.json()

    let result

    switch (action) {
      case 'delete':
        if (workflowIds && workflowIds.length > 0) {
          // Delete specific workflows
          result = await WorkflowAPI.bulkDeleteWorkflows(workflowIds, clerkId)
        } else if (filters) {
          // Delete workflows matching filters
          result = await WorkflowAPI.deleteWorkflowsByFilters(clerkId, filters)
        } else {
          return NextResponse.json(
            { success: false, error: 'Either workflowIds or filters required' },
            { status: 400 }
          )
        }
        break

      case 'cleanup_templates':
        // Delete all template/demo workflows for the user
        result = await WorkflowAPI.cleanupTemplateWorkflows(clerkId)
        break

      case 'export':
        // Export workflows
        result = await WorkflowAPI.exportWorkflows(workflowIds || [], clerkId)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/workflows/bulk error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/workflows/bulk - Get workflow statistics
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await WorkflowAPI.getWorkflowStats(clerkId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('GET /api/workflows/bulk error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
