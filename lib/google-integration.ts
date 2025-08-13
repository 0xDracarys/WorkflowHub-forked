import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Scopes for different Google services
export const GOOGLE_SCOPES = {
  CALENDAR: 'https://www.googleapis.com/auth/calendar',
  DRIVE: 'https://www.googleapis.com/auth/drive',
  GMAIL: 'https://www.googleapis.com/auth/gmail.readonly',
  SHEETS: 'https://www.googleapis.com/auth/spreadsheets',
  DOCS: 'https://www.googleapis.com/auth/documents'
}

// Get authorization URL
export function getGoogleAuthUrl(state?: string) {
  const scopes = Object.values(GOOGLE_SCOPES)
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: state,
    prompt: 'consent' // Force consent screen to ensure refresh token
  })
  
  return authUrl
}

// Exchange authorization code for tokens
export async function getTokensFromCode(code: string) {
  try {
    const { tokens } = await oauth2Client.getAccessToken(code)
    return tokens
  } catch (error) {
    console.error('Error getting tokens from code:', error)
    throw new Error('Failed to exchange authorization code for tokens')
  }
}

// Set credentials for OAuth2 client
export function setGoogleCredentials(accessToken: string, refreshToken?: string) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })
  return oauth2Client
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  try {
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    })
    
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw new Error('Failed to refresh access token')
  }
}

// Google Calendar integration
export class GoogleCalendarService {
  private calendar
  
  constructor(auth: OAuth2Client) {
    this.calendar = google.calendar({ version: 'v3', auth })
  }
  
  async getEvents(timeMin?: string, timeMax?: string) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 10
      })
      
      return response.data.items || []
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      throw new Error('Failed to fetch calendar events')
    }
  }
  
  async createEvent(event: any) {
    try {
      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
      })
      
      return response.data
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw new Error('Failed to create calendar event')
    }
  }
}

// Google Drive integration
export class GoogleDriveService {
  private drive
  
  constructor(auth: OAuth2Client) {
    this.drive = google.drive({ version: 'v3', auth })
  }
  
  async getFiles(pageSize = 10) {
    try {
      const response = await this.drive.files.list({
        pageSize,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)'
      })
      
      return response.data.files || []
    } catch (error) {
      console.error('Error fetching Drive files:', error)
      throw new Error('Failed to fetch Drive files')
    }
  }
  
  async createFolder(name: string, parentId?: string) {
    try {
      const fileMetadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentId ? [parentId] : undefined
      }
      
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id'
      })
      
      return response.data
    } catch (error) {
      console.error('Error creating Drive folder:', error)
      throw new Error('Failed to create Drive folder')
    }
  }
}

// Google Sheets integration
export class GoogleSheetsService {
  private sheets
  
  constructor(auth: OAuth2Client) {
    this.sheets = google.sheets({ version: 'v4', auth })
  }
  
  async getSpreadsheet(spreadsheetId: string) {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId
      })
      
      return response.data
    } catch (error) {
      console.error('Error fetching spreadsheet:', error)
      throw new Error('Failed to fetch spreadsheet')
    }
  }
  
  async getValues(spreadsheetId: string, range: string) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      })
      
      return response.data.values || []
    } catch (error) {
      console.error('Error fetching spreadsheet values:', error)
      throw new Error('Failed to fetch spreadsheet values')
    }
  }
  
  async updateValues(spreadsheetId: string, range: string, values: any[][]) {
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        requestBody: {
          values
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error updating spreadsheet values:', error)
      throw new Error('Failed to update spreadsheet values')
    }
  }
}

// Google Docs integration
export class GoogleDocsService {
  private docs
  
  constructor(auth: OAuth2Client) {
    this.docs = google.docs({ version: 'v1', auth })
  }
  
  async getDocument(documentId: string) {
    try {
      const response = await this.docs.documents.get({
        documentId
      })
      
      return response.data
    } catch (error) {
      console.error('Error fetching document:', error)
      throw new Error('Failed to fetch document')
    }
  }
  
  async createDocument(title: string) {
    try {
      const response = await this.docs.documents.create({
        requestBody: {
          title
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error creating document:', error)
      throw new Error('Failed to create document')
    }
  }
}

// Gmail integration
export class GmailService {
  private gmail
  
  constructor(auth: OAuth2Client) {
    this.gmail = google.gmail({ version: 'v1', auth })
  }
  
  async getMessages(query?: string, maxResults = 10) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      })
      
      return response.data.messages || []
    } catch (error) {
      console.error('Error fetching Gmail messages:', error)
      throw new Error('Failed to fetch Gmail messages')
    }
  }
  
  async getMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId
      })
      
      return response.data
    } catch (error) {
      console.error('Error fetching Gmail message:', error)
      throw new Error('Failed to fetch Gmail message')
    }
  }
}

// Factory function to create service instances
export function createGoogleServices(accessToken: string, refreshToken?: string) {
  const auth = setGoogleCredentials(accessToken, refreshToken)
  
  return {
    calendar: new GoogleCalendarService(auth),
    drive: new GoogleDriveService(auth),
    sheets: new GoogleSheetsService(auth),
    docs: new GoogleDocsService(auth),
    gmail: new GmailService(auth)
  }
}
