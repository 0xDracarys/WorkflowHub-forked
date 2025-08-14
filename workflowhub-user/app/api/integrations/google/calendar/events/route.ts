import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { createOAuth2Client } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const oauth2Client = await createOAuth2Client(userId)
    if (!oauth2Client) {
      return NextResponse.json({ error: 'Google integration not connected' }, { status: 400 })
    }

    // Import Google APIs
    const { google } = await import('googleapis')
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

    // Get events from the past week and next month
    const timeMin = new Date()
    timeMin.setDate(timeMin.getDate() - 7) // 7 days ago
    
    const timeMax = new Date()
    timeMax.setDate(timeMax.getDate() + 30) // 30 days from now

    // Fetch events from primary calendar
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
      fields: 'items(id, summary, start, end, attendees, location, description, status)'
    })

    const events = response.data.items?.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
      attendees: event.attendees?.map(attendee => ({
        email: attendee.email
      })),
      location: event.location,
      description: event.description,
      status: event.status
    })) || []

    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    })

  } catch (error: any) {
    console.error('Error fetching Google Calendar events:', error)
    
    if (error.code === 401) {
      return NextResponse.json({ 
        error: 'Token expired or invalid', 
        requiresReauth: true 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      error: 'Failed to fetch events',
      details: error.message 
    }, { status: 500 })
  }
}
