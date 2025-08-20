import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { UserAPI } from '@/lib/user-api'
import { GoogleServices } from '@/lib/google-services'

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user || !user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userProfile = await UserAPI.getUserById(user.id)
    if (!userProfile?.googleTokens?.accessToken) {
      return NextResponse.json({ success: false, error: 'Google account not connected or tokens expired' }, { status: 400 })
    }

    const googleServices = new GoogleServices(userProfile.googleTokens)
    const { success, workflows, error } = await googleServices.importCalendarWorkflows(user.id)

    if (success) {
      console.log(`Imported ${workflows.length} workflows from Google Calendar for user ${user.id}`)
      return NextResponse.json({ success: true, workflows })
    } else {
      return NextResponse.json({ success: false, error: error || 'Failed to import Calendar workflows' }, { status: 500 })
    }
  } catch (err) {
    console.error('Error in /api/google/calendar-workflows:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
