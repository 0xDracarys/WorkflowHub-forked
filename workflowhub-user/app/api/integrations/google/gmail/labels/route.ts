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
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Fetch labels from Gmail
    const response = await gmail.users.labels.list({
      userId: 'me'
    })

    const labels = response.data.labels?.map(label => ({
      id: label.id,
      name: label.name,
      type: label.type,
      messagesTotal: label.messagesTotal,
      messagesUnread: label.messagesUnread,
      color: label.color
    })) || []

    // Sort labels by type (system first, then user labels)
    const sortedLabels = labels.sort((a, b) => {
      if (a.type === 'system' && b.type !== 'system') return -1
      if (a.type !== 'system' && b.type === 'system') return 1
      return (a.name || '').localeCompare(b.name || '')
    })

    return NextResponse.json({ 
      success: true, 
      labels: sortedLabels,
      count: sortedLabels.length 
    })

  } catch (error: any) {
    console.error('Error fetching Gmail labels:', error)
    
    if (error.code === 401) {
      return NextResponse.json({ 
        error: 'Token expired or invalid', 
        requiresReauth: true 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      error: 'Failed to fetch labels',
      details: error.message 
    }, { status: 500 })
  }
}
