import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleServices } from '@/lib/google-services'
import { UserAPI } from '@/lib/user-api'
import { google } from 'googleapis'

interface ConnectionTestResults {
  tokenInfo: {
    accessToken: boolean
    refreshToken: boolean
    expired: boolean
    scope: string[]
  }
  userInfo: {
    success: boolean
    email?: string
    name?: string
    error?: string
  }
  googleDrive: {
    success: boolean
    count: number
    files?: any[]
    error?: string
  }
  googleCalendar: {
    success: boolean
    count: number
    events?: any[]
    error?: string
  }
  gmail: {
    success: boolean
    count: number
    labels?: any[]
    error?: string
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's Google tokens
    const userResult = await UserAPI.getUserByClerkId(clerkId)
    if (!userResult.success || !userResult.data?.googleTokens) {
      return NextResponse.json(
        { success: false, error: 'Google account not connected' },
        { status: 400 }
      )
    }

    const tokens = userResult.data.googleTokens
    const googleServices = new GoogleServices(tokens)

    // Initialize test results
    const results: ConnectionTestResults = {
      tokenInfo: {
        accessToken: !!tokens.accessToken,
        refreshToken: !!tokens.refreshToken,
        expired: tokens.expiryDate ? Date.now() > tokens.expiryDate : true,
        scope: tokens.scope ? tokens.scope.split(' ') : []
      },
      userInfo: {
        success: false
      },
      googleDrive: {
        success: false,
        count: 0
      },
      googleCalendar: {
        success: false,
        count: 0
      },
      gmail: {
        success: false,
        count: 0
      }
    }

    // Test user info
    try {
      const userInfoResult = await googleServices.getUserInfo()
      if (userInfoResult.success && userInfoResult.data) {
        results.userInfo = {
          success: true,
          email: userInfoResult.data.email,
          name: userInfoResult.data.name
        }
      } else {
        results.userInfo = {
          success: false,
          error: userInfoResult.error || 'Failed to get user info'
        }
      }
    } catch (error) {
      results.userInfo = {
        success: false,
        error: 'Failed to get user info'
      }
    }

    // Test Google Drive access
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
      
      oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      })

      const drive = google.drive({ version: 'v3', auth: oauth2Client })
      const driveResponse = await drive.files.list({
        pageSize: 10,
        fields: 'files(id, name, mimeType)'
      })

      results.googleDrive = {
        success: true,
        count: driveResponse.data.files?.length || 0,
        files: driveResponse.data.files
      }
    } catch (error) {
      results.googleDrive = {
        success: false,
        count: 0,
        error: 'Failed to access Google Drive'
      }
    }

    // Test Google Calendar access
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
      
      oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      })

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const now = new Date()
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const calendarResponse = await calendar.events.list({
        calendarId: 'primary',
        timeMin: oneWeekAgo.toISOString(),
        timeMax: now.toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
      })

      results.googleCalendar = {
        success: true,
        count: calendarResponse.data.items?.length || 0,
        events: calendarResponse.data.items
      }
    } catch (error) {
      results.googleCalendar = {
        success: false,
        count: 0,
        error: 'Failed to access Google Calendar'
      }
    }

    // Test Gmail access
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
      
      oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      })

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
      const gmailResponse = await gmail.users.labels.list({
        userId: 'me'
      })

      const customLabels = gmailResponse.data.labels?.filter(label => 
        label.type === 'user' && 
        !['IMPORTANT', 'STARRED', 'TRASH'].includes(label.name || '')
      ) || []

      results.gmail = {
        success: true,
        count: customLabels.length,
        labels: customLabels
      }
    } catch (error) {
      results.gmail = {
        success: false,
        count: 0,
        error: 'Failed to access Gmail'
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error testing Google integration:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
