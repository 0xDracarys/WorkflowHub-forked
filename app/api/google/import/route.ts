import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleServices } from '@/lib/google-services'
import { UserAPI } from '@/lib/user-api'
import { WorkflowAPI } from '@/lib/workflow-api'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { importTypes } = await request.json()
    
    // Get user's Google tokens
    const userResult = await UserAPI.getUserByClerkId(clerkId)
    if (!userResult.success || !userResult.data?.googleTokens) {
      return NextResponse.json(
        { success: false, error: 'Google account not connected' },
        { status: 400 }
      )
    }

    const googleServices = new GoogleServices(userResult.data.googleTokens)
    const importResults = []
    let totalImported = 0

    // Import from Google Drive
    if (importTypes.includes('drive')) {
      const driveResult = await googleServices.importDriveWorkflows(clerkId)
      if (driveResult.success) {
        for (const workflow of driveResult.workflows) {
          const createResult = await WorkflowAPI.createWorkflow(workflow)
          if (createResult.success) {
            totalImported++
          }
        }
        importResults.push({
          type: 'drive',
          count: driveResult.workflows.length,
          message: `Imported ${driveResult.workflows.length} workflows from Google Drive`
        })
      }
    }

    // Import from Google Calendar
    if (importTypes.includes('calendar')) {
      const calendarResult = await googleServices.importCalendarWorkflows(clerkId)
      if (calendarResult.success) {
        for (const workflow of calendarResult.workflows) {
          const createResult = await WorkflowAPI.createWorkflow(workflow)
          if (createResult.success) {
            totalImported++
          }
        }
        importResults.push({
          type: 'calendar',
          count: calendarResult.workflows.length,
          message: `Imported ${calendarResult.workflows.length} workflows from Google Calendar`
        })
      }
    }

    // Import from Gmail
    if (importTypes.includes('gmail')) {
      const gmailResult = await googleServices.importGmailWorkflows(clerkId)
      if (gmailResult.success) {
        for (const workflow of gmailResult.workflows) {
          const createResult = await WorkflowAPI.createWorkflow(workflow)
          if (createResult.success) {
            totalImported++
          }
        }
        importResults.push({
          type: 'gmail',
          count: gmailResult.workflows.length,
          message: `Imported ${gmailResult.workflows.length} workflows from Gmail`
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${totalImported} workflows from Google services`,
      data: {
        totalImported,
        results: importResults
      }
    })

  } catch (error) {
    console.error('Error importing Google workflows:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import workflows' },
      { status: 500 }
    )
  }
}

// GET endpoint to preview what would be imported
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
    const previewType = searchParams.get('type') || 'all'

    // Get user's Google tokens
    const userResult = await UserAPI.getUserByClerkId(clerkId)
    if (!userResult.success || !userResult.data?.googleTokens) {
      return NextResponse.json(
        { success: false, error: 'Google account not connected' },
        { status: 400 }
      )
    }

    const googleServices = new GoogleServices(userResult.data.googleTokens)
    const preview = {
      drive: { count: 0, items: [] },
      calendar: { count: 0, items: [] },
      gmail: { count: 0, items: [] }
    }

    if (previewType === 'all' || previewType === 'drive') {
      const driveResult = await googleServices.importDriveWorkflows(clerkId)
      if (driveResult.success) {
        preview.drive = {
          count: driveResult.workflows.length,
          items: driveResult.workflows.map(w => ({
            title: w.title,
            description: w.description,
            category: w.category,
            steps: w.steps.length
          }))
        }
      }
    }

    if (previewType === 'all' || previewType === 'calendar') {
      const calendarResult = await googleServices.importCalendarWorkflows(clerkId)
      if (calendarResult.success) {
        preview.calendar = {
          count: calendarResult.workflows.length,
          items: calendarResult.workflows.map(w => ({
            title: w.title,
            description: w.description,
            category: w.category,
            steps: w.steps.length
          }))
        }
      }
    }

    if (previewType === 'all' || previewType === 'gmail') {
      const gmailResult = await googleServices.importGmailWorkflows(clerkId)
      if (gmailResult.success) {
        preview.gmail = {
          count: gmailResult.workflows.length,
          items: gmailResult.workflows.map(w => ({
            title: w.title,
            description: w.description,
            category: w.category,
            steps: w.steps.length
          }))
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: preview
    })

  } catch (error) {
    console.error('Error previewing Google workflows:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to preview workflows' },
      { status: 500 }
    )
  }
}
