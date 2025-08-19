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
      
      // Search for relevant files (docs, sheets, presentations) - exclude test files and generic names
      const response = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.presentation'",
        fields: 'files(id, name, mimeType, createdTime, modifiedTime, description, parents)',
        pageSize: 20,
        orderBy: 'modifiedTime desc'
      })

      const workflows = []
      
      for (const file of response.data.files || []) {
        // Skip generic or test files
        if (this.isGenericFile(file.name)) continue
        
        const workflowType = this.detectWorkflowType(file.name, file.description)
        const steps = this.generateMeaningfulSteps(file, workflowType)
        
        // Only create workflows with meaningful content
        if (steps.length > 0) {
          workflows.push({
            title: this.generateWorkflowTitle(file.name, workflowType),
            description: this.generateWorkflowDescription(file, workflowType),
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
      }

      // Limit to most relevant workflows
      return { success: true, workflows: workflows.slice(0, 5) }
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

  // Helper methods for intelligent workflow generation
  private isGenericFile(fileName: string | null | undefined): boolean {
    if (!fileName) return true
    
    const genericPatterns = [
      /^untitled/i,
      /^new document/i,
      /^copy of/i,
      /^test/i,
      /^draft/i,
      /^temp/i,
      /^tmp/i,
      /^document\d*$/i,
      /^spreadsheet\d*$/i,
      /^presentation\d*$/i
    ]
    
    return genericPatterns.some(pattern => pattern.test(fileName))
  }

  private detectWorkflowType(fileName: string | null | undefined, description?: string | null): string {
    const content = `${fileName || ''} ${description || ''}`.toLowerCase()
    
    // Client/Project workflow patterns
    if (/client|project|proposal|contract|agreement/.test(content)) {
      return 'client-management'
    }
    
    // Content creation patterns
    if (/content|blog|article|social|post|marketing|copy/.test(content)) {
      return 'content-creation'
    }
    
    // Business process patterns
    if (/process|procedure|workflow|checklist|onboard/.test(content)) {
      return 'business-process'
    }
    
    // Report/Analytics patterns
    if (/report|analytics|data|metrics|dashboard|kpi/.test(content)) {
      return 'reporting'
    }
    
    // Template patterns
    if (/template|invoice|quote|estimate/.test(content)) {
      return 'template'
    }
    
    return 'general'
  }

  private generateWorkflowTitle(fileName: string | null | undefined, workflowType: string): string {
    if (!fileName) return 'Imported Workflow'
    
    const cleanName = fileName.replace(/\.(docx?|xlsx?|pptx?)$/i, '')
    
    switch (workflowType) {
      case 'client-management':
        return `${cleanName} - Client Management Workflow`
      case 'content-creation':
        return `${cleanName} - Content Creation Process`
      case 'business-process':
        return `${cleanName} - Business Process`
      case 'reporting':
        return `${cleanName} - Reporting Workflow`
      case 'template':
        return `${cleanName} - Template Workflow`
      default:
        return `${cleanName} - Document Workflow`
    }
  }

  private generateWorkflowDescription(file: any, workflowType: string): string {
    const baseDescription = file.description || ''
    const fileName = file.name || 'document'
    
    const typeDescriptions = {
      'client-management': `Client management workflow based on ${fileName}. Streamline your client onboarding, communication, and project delivery process.`,
      'content-creation': `Content creation workflow derived from ${fileName}. Manage your content planning, creation, review, and publishing process.`,
      'business-process': `Business process workflow based on ${fileName}. Standardize and automate your business procedures for consistency and efficiency.`,
      'reporting': `Reporting workflow based on ${fileName}. Automate data collection, analysis, and report generation for better insights.`,
      'template': `Template-based workflow for ${fileName}. Streamline document creation and standardize your outputs.`,
      'general': `Document workflow for ${fileName}. Manage document creation, review, and approval processes.`
    }
    
    return baseDescription || typeDescriptions[workflowType] || typeDescriptions['general']
  }

  private generateMeaningfulSteps(file: any, workflowType: string): any[] {
    const baseId = Date.now()
    
    switch (workflowType) {
      case 'client-management':
        return [
          {
            id: `step_${baseId}_1`,
            title: 'Client Intake',
            description: 'Gather client requirements and project details',
            type: 'form',
            config: { 
              fields: ['client_name', 'project_scope', 'timeline', 'budget'],
              googleDocId: file.id
            },
            position: { x: 100, y: 100 },
            connections: ['step_${baseId}_2']
          },
          {
            id: `step_${baseId}_2`,
            title: 'Proposal Creation',
            description: 'Create and send project proposal',
            type: 'action',
            config: { 
              action: 'create_proposal',
              template: file.id
            },
            position: { x: 300, y: 100 },
            connections: ['step_${baseId}_3']
          },
          {
            id: `step_${baseId}_3`,
            title: 'Client Approval',
            description: 'Wait for client approval and signature',
            type: 'approval',
            config: { 
              approver: 'client',
              required: true
            },
            position: { x: 500, y: 100 },
            connections: ['step_${baseId}_4']
          },
          {
            id: `step_${baseId}_4`,
            title: 'Project Kickoff',
            description: 'Initialize project and set up communication channels',
            type: 'action',
            config: { 
              action: 'project_kickoff'
            },
            position: { x: 700, y: 100 },
            connections: []
          }
        ]
        
      case 'content-creation':
        return [
          {
            id: `step_${baseId}_1`,
            title: 'Content Brief',
            description: 'Define content objectives and requirements',
            type: 'form',
            config: { 
              fields: ['topic', 'target_audience', 'key_messages', 'deadline'],
              googleDocId: file.id
            },
            position: { x: 100, y: 100 },
            connections: ['step_${baseId}_2']
          },
          {
            id: `step_${baseId}_2`,
            title: 'Content Creation',
            description: 'Write and develop the content',
            type: 'action',
            config: { 
              action: 'create_content',
              template: file.id
            },
            position: { x: 300, y: 100 },
            connections: ['step_${baseId}_3']
          },
          {
            id: `step_${baseId}_3`,
            title: 'Review & Edit',
            description: 'Review content for quality and brand alignment',
            type: 'review',
            config: { 
              reviewers: ['editor', 'brand_manager']
            },
            position: { x: 500, y: 100 },
            connections: ['step_${baseId}_4']
          },
          {
            id: `step_${baseId}_4`,
            title: 'Publish Content',
            description: 'Publish approved content to designated channels',
            type: 'action',
            config: { 
              action: 'publish_content'
            },
            position: { x: 700, y: 100 },
            connections: []
          }
        ]
        
      case 'reporting':
        return [
          {
            id: `step_${baseId}_1`,
            title: 'Data Collection',
            description: 'Gather data from various sources',
            type: 'action',
            config: { 
              action: 'collect_data',
              googleSheetId: file.id
            },
            position: { x: 100, y: 100 },
            connections: ['step_${baseId}_2']
          },
          {
            id: `step_${baseId}_2`,
            title: 'Data Analysis',
            description: 'Analyze data and generate insights',
            type: 'action',
            config: { 
              action: 'analyze_data'
            },
            position: { x: 300, y: 100 },
            connections: ['step_${baseId}_3']
          },
          {
            id: `step_${baseId}_3`,
            title: 'Report Generation',
            description: 'Create comprehensive report with findings',
            type: 'action',
            config: { 
              action: 'generate_report',
              template: file.id
            },
            position: { x: 500, y: 100 },
            connections: ['step_${baseId}_4']
          },
          {
            id: `step_${baseId}_4`,
            title: 'Report Distribution',
            description: 'Share report with stakeholders',
            type: 'action',
            config: { 
              action: 'distribute_report'
            },
            position: { x: 700, y: 100 },
            connections: []
          }
        ]
        
      default:
        return [
          {
            id: `step_${baseId}_1`,
            title: 'Document Setup',
            description: `Initialize ${file.name || 'document'} workflow`,
            type: 'action',
            config: { 
              googleDocId: file.id,
              action: 'setup_document'
            },
            position: { x: 100, y: 100 },
            connections: ['step_${baseId}_2']
          },
          {
            id: `step_${baseId}_2`,
            title: 'Review & Approval',
            description: 'Review document and get necessary approvals',
            type: 'approval',
            config: { 
              required: true
            },
            position: { x: 300, y: 100 },
            connections: ['step_${baseId}_3']
          },
          {
            id: `step_${baseId}_3`,
            title: 'Finalize',
            description: 'Complete and distribute final document',
            type: 'action',
            config: { 
              action: 'finalize_document'
            },
            position: { x: 500, y: 100 },
            connections: []
          }
        ]
    }
  }
}
