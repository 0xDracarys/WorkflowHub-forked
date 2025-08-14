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
    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Fetch files from Google Drive
    const response = await drive.files.list({
      pageSize: 50,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime, webViewLink, owners)',
      orderBy: 'modifiedTime desc'
    })

    const files = response.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      modifiedTime: file.modifiedTime,
      webViewLink: file.webViewLink,
      owners: file.owners?.map(owner => ({
        displayName: owner.displayName
      }))
    })) || []

    return NextResponse.json({ 
      success: true, 
      files,
      count: files.length 
    })

  } catch (error: any) {
    console.error('Error fetching Google Drive files:', error)
    
    if (error.code === 401) {
      return NextResponse.json({ 
        error: 'Token expired or invalid', 
        requiresReauth: true 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      error: 'Failed to fetch files',
      details: error.message 
    }, { status: 500 })
  }
}
