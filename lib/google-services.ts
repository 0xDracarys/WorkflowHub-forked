import { google } from 'googleapis'

interface GoogleTokens {
  accessToken: string
  refreshToken: string
  scope: string
  tokenType: string
  expiryDate: number
}

export class GoogleServices {
  private oauth2Client: any

  constructor(tokens: GoogleTokens) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    this.oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expiry_date: tokens.expiryDate,
      token_type: tokens.tokenType,
      scope: tokens.scope
    })
  }

  // Import Google Drive files as workflow templates
  async importDriveWorkflows(userId: string) {
    try {
      const drive = google.drive({ version: 'v3', auth: this.oauth2Client })
      
      // Search for relevant files (docs, sheets, presentations)
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation' or mimeType='application/vnd.google-apps.folder'",
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, description)',
        pageSize: 50
      })

      const workflows = []
      
      for (const file of response.data.files || []) {
        let workflowType = 'document'
        let steps = []

        switch (file.mimeType) {
          case 'application/vnd.google-apps.document':
            workflowType = 'content-creation'
            steps = [
              {
                id: `step_${Date.now()}_1`,
                title: 'Document Review',
                description: `Review and edit: ${file.name}`,
                type: 'action',
                config: { 
                  googleDocId: file.id,
                  action: 'review_document'
                },
                position: { x: 100, y: 100 },
                connections: []
              },
              {
                id: `step_${Date.now()}_2`,
                title: 'Client Approval',
                description: 'Get client feedback and approval',
                type: 'condition',
                config: { 
                  condition: 'client_approved'
                },
                position: { x: 300, y: 100 },
                connections: []
              }
            ]
            break

          case 'application/vnd.google-apps.spreadsheet':
            workflowType = 'data-management'
            steps = [
              {
                id: `step_${Date.now()}_1`,
                title: 'Data Collection',
                description: `Update spreadsheet: ${file.name}`,
                type: 'action',
                config: { 
                  googleSheetId: file.id,
                  action: 'update_data'
                },
                position: { x: 100, y: 100 },
                connections: []
              },
              {
                id: `step_${Date.now()}_2`,
                title: 'Generate Report',
                description: 'Create summary report from data',
                type: 'action',
                config: { 
                  action: 'generate_report'
                },
                position: { x: 300, y: 100 },
                connections: []
              }
            ]
            break

          case 'application/vnd.google-apps.presentation':
            workflowType = 'presentation'
            steps = [
              {
                id: `step_${Date.now()}_1`,
                title: 'Slide Preparation',
                description: `Prepare slides: ${file.name}`,
                type: 'action',
                config: { 
                  googleSlideId: file.id,
                  action: 'prepare_slides'
                },
                position: { x: 100, y: 100 },
                connections: []
              }
            ]
            break
        }

        workflows.push({
          title: file.name || 'Imported Workflow',
          description: file.description || `Imported from Google Drive - ${workflowType}`,
          category: this.mapToCategory(workflowType),
          tags: ['imported', 'google-drive', workflowType],
          isPublic: false,
          userId: userId,
          steps: steps,
          importedFrom: 'google-drive',
          originalFileId: file.id,
          originalMimeType: file.mimeType
        })
      }

      return { success: true, workflows }
    } catch (error) {
      console.error('Error importing Drive workflows:', error)
      return { success: false, error: 'Failed to import Google Drive content' }
    }
  }

  // Import Google Calendar events as workflow templates
  async importCalendarWorkflows(userId: string) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      // Get recurring events from the past 3 months
      const now = new Date()
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: threeMonthsAgo.toISOString(),
        timeMax: now.toISOString(),
        singleEvents: false, // Get recurring events
        orderBy: 'startTime'
      })

      const workflows = []
      const processedEvents = new Set()

      for (const event of response.data.items || []) {
        // Skip if we've already processed this recurring event
        if (event.recurringEventId && processedEvents.has(event.recurringEventId)) {
          continue
        }
        
        // Only import recurring events or events with attendees (likely client meetings)
        if (event.recurrence || (event.attendees && event.attendees.length > 1)) {
          if (event.recurringEventId) {
            processedEvents.add(event.recurringEventId)
          }

          const steps = [
            {
              id: `step_${Date.now()}_1`,
              title: 'Pre-Meeting Preparation',
              description: 'Prepare materials and agenda',
              type: 'action',
              config: { 
                preparation_time: '30 minutes'
              },
              position: { x: 100, y: 100 },
              connections: []
            },
            {
              id: `step_${Date.now()}_2`,
              title: 'Meeting/Event',
              description: event.summary || 'Calendar Event',
              type: 'action',
              config: { 
                googleEventId: event.id,
                duration: this.calculateDuration(event.start, event.end),
                attendees: event.attendees?.map(a => a.email) || []
              },
              position: { x: 300, y: 100 },
              connections: []
            },
            {
              id: `step_${Date.now()}_3`,
              title: 'Follow-up Actions',
              description: 'Send follow-up and action items',
              type: 'action',
              config: { 
                action: 'send_followup'
              },
              position: { x: 500, y: 100 },
              connections: []
            }
          ]

          workflows.push({
            title: `${event.summary || 'Calendar Event'} Workflow`,
            description: `Imported calendar workflow: ${event.description || 'Recurring event or client meeting'}`,
            category: 'Meeting Management',
            tags: ['imported', 'google-calendar', 'meetings'],
            isPublic: false,
            userId: userId,
            steps: steps,
            importedFrom: 'google-calendar',
            originalEventId: event.id,
            recurrence: event.recurrence
          })
        }
      }

      return { success: true, workflows }
    } catch (error) {
      console.error('Error importing Calendar workflows:', error)
      return { success: false, error: 'Failed to import Google Calendar events' }
    }
  }

  // Import Gmail labels and filters as workflow automation
  async importGmailWorkflows(userId: string) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client })
      
      // Get labels (custom labels often represent workflows)
      const labelsResponse = await gmail.users.labels.list({ userId: 'me' })
      const customLabels = labelsResponse.data.labels?.filter(label => 
        label.type === 'user' && 
        !['IMPORTANT', 'STARRED', 'TRASH'].includes(label.name || '')
      ) || []

      // Get filters
      const filtersResponse = await gmail.users.settings.filters.list({ userId: 'me' })
      const filters = filtersResponse.data.filter || []

      const workflows = []

      // Create workflows from labels (representing email organization systems)
      for (const label of customLabels) {
        const steps = [
          {
            id: `step_${Date.now()}_1`,
            title: 'Email Triage',
            description: `Organize emails with label: ${label.name}`,
            type: 'condition',
            config: { 
              gmailLabelId: label.id,
              condition: 'email_received'
            },
            position: { x: 100, y: 100 },
            connections: []
          },
          {
            id: `step_${Date.now()}_2`,
            title: 'Process Email',
            description: 'Review and respond to emails',
            type: 'action',
            config: { 
              action: 'process_email'
            },
            position: { x: 300, y: 100 },
            connections: []
          },
          {
            id: `step_${Date.now()}_3`,
            title: 'Archive or Follow-up',
            description: 'Complete email processing',
            type: 'condition',
            config: { 
              condition: 'email_processed'
            },
            position: { x: 500, y: 100 },
            connections: []
          }
        ]

        workflows.push({
          title: `${label.name} Email Workflow`,
          description: `Email management workflow for ${label.name} category`,
          category: 'Email Management',
          tags: ['imported', 'gmail', 'email-automation'],
          isPublic: false,
          userId: userId,
          steps: steps,
          importedFrom: 'gmail',
          originalLabelId: label.id
        })
      }

      return { success: true, workflows }
    } catch (error) {
      console.error('Error importing Gmail workflows:', error)
      return { success: false, error: 'Failed to import Gmail organization' }
    }
  }

  // Helper methods
  private mapToCategory(type: string): string {
    const categoryMap: { [key: string]: string } = {
      'content-creation': 'Content Creation',
      'data-management': 'Data Processing',
      'presentation': 'Marketing',
      'document': 'Content Creation'
    }
    return categoryMap[type] || 'General'
  }

  private calculateDuration(start: any, end: any): string {
    if (!start?.dateTime || !end?.dateTime) return 'Unknown duration'
    
    const startTime = new Date(start.dateTime)
    const endTime = new Date(end.dateTime)
    const diffMs = endTime.getTime() - startTime.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  // Test connection and get user info
  async getUserInfo() {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client })
      const response = await oauth2.userinfo.get()
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Error getting user info:', error)
      return { success: false, error: 'Failed to get user information' }
    }
  }
}
