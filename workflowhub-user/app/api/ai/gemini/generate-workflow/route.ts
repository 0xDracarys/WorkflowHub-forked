import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createOAuth2Client } from '@/lib/google-oauth'

// POST /api/ai/gemini/generate-workflow
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt, context, useUserAccount } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    let genAI: GoogleGenerativeAI
    let apiKey: string

    // Check if user wants to use their Google Pro account
    if (useUserAccount) {
      // Try to get user's Google OAuth client to check for Pro account
      const oauth2Client = await createOAuth2Client(clerkId)
      
      if (!oauth2Client) {
        return NextResponse.json(
          { success: false, error: 'Google account not connected' },
          { status: 400 }
        )
      }

      // Check if user has access to Gemini Pro through their account
      try {
        const { google } = await import('googleapis')
        
        // This is a placeholder - Google doesn't expose Pro account status via API yet
        // In the future, you would check user's subscription status here
        const userHasProAccess = await checkUserGoogleProAccess(oauth2Client)
        
        if (userHasProAccess) {
          // Use user's Pro account API key (stored securely)
          apiKey = await getUserGeminiApiKey(clerkId)
        } else {
          // Fall back to default Gemini model
          apiKey = process.env.GEMINI_API_KEY!
        }
      } catch (error) {
        console.warn('Could not verify Pro account, using default:', error)
        apiKey = process.env.GEMINI_API_KEY!
      }
    } else {
      // Use default API key
      apiKey = process.env.GEMINI_API_KEY!
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    genAI = new GoogleGenerativeAI(apiKey)

    // Choose model based on user's access
    const modelName = useUserAccount ? 'gemini-1.5-pro' : 'gemini-1.5-flash'
    const model = genAI.getGenerativeModel({ model: modelName })

    // Get user's Google data for context if available
    const userContext = await getUserGoogleContext(clerkId)

    // Create enhanced prompt for workflow generation
    const enhancedPrompt = `
You are an expert workflow automation assistant. Create a detailed workflow based on the user's request.

User Request: ${prompt}

${context ? `Additional Context: ${context}` : ''}

${userContext ? `User's Google Data Context: ${userContext}` : ''}

Please generate a workflow in the following JSON format:
{
  "name": "Workflow Name",
  "description": "Detailed description",
  "category": "automation|marketing|productivity|business|other",
  "tags": ["tag1", "tag2"],
  "steps": [
    {
      "id": "step1",
      "name": "Step Name",
      "description": "What this step does",
      "type": "trigger|action|condition|loop",
      "service": "google|email|webhook|other",
      "config": {
        "// Service-specific configuration"
      }
    }
  ],
  "integrations": ["google-drive", "gmail", "calendar"],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": "5 minutes",
  "triggers": [
    {
      "type": "schedule|webhook|file_change|email",
      "config": {}
    }
  ]
}

Focus on:
1. Creating practical, actionable steps
2. Using available Google integrations when relevant
3. Providing clear descriptions for each step
4. Making the workflow easy to understand and implement
5. Including proper error handling suggestions

Generate only the JSON response, no additional text.
`

    const result = await model.generateContent(enhancedPrompt)
    const response = await result.response
    const generatedText = response.text()

    // Parse the JSON response
    let workflowData
    try {
      // Clean the response to extract JSON
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      workflowData = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      return NextResponse.json(
        { success: false, error: 'Failed to parse AI response' },
        { status: 500 }
      )
    }

    // Enhance workflow with metadata
    const enhancedWorkflow = {
      ...workflowData,
      id: `ai-generated-${Date.now()}`,
      userId: clerkId,
      isPublic: false,
      isTemplate: false,
      generatedByAI: true,
      aiModel: modelName,
      createdAt: new Date(),
      usageCount: 0,
      rating: 0,
      reviews: []
    }

    return NextResponse.json({
      success: true,
      data: {
        workflow: enhancedWorkflow,
        modelUsed: modelName,
        userProAccess: useUserAccount,
        tokensUsed: result.response.usageMetadata?.totalTokenCount || 0
      }
    })

  } catch (error: any) {
    console.error('Gemini workflow generation error:', error)
    
    if (error.message?.includes('API_KEY')) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate workflow' },
      { status: 500 }
    )
  }
}

// Helper function to check if user has Google Pro access
async function checkUserGoogleProAccess(oauth2Client: any): Promise<boolean> {
  try {
    // This is a placeholder - actual implementation would depend on
    // Google's API for checking subscription status
    // For now, we'll return false and use the default model
    return false
  } catch (error) {
    return false
  }
}

// Helper function to get user's Gemini API key (if they've provided one)
async function getUserGeminiApiKey(userId: string): Promise<string | null> {
  try {
    // This would fetch from your secure storage where users can store their own API keys
    // For now, return null to use default
    return null
  } catch (error) {
    return null
  }
}

// Helper function to get user's Google context for better workflow generation
async function getUserGoogleContext(userId: string): Promise<string> {
  try {
    const oauth2Client = await createOAuth2Client(userId)
    if (!oauth2Client) return ''

    // Get quick summary of user's Google data
    const context = []
    
    try {
      const { google } = await import('googleapis')
      
      // Get Drive file count
      const drive = google.drive({ version: 'v3', auth: oauth2Client })
      const driveResponse = await drive.files.list({ pageSize: 1 })
      if (driveResponse.data.files?.length) {
        context.push(`Has Google Drive with files`)
      }

      // Get Calendar events
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const calendarResponse = await calendar.events.list({
        calendarId: 'primary',
        maxResults: 1,
        timeMin: new Date().toISOString()
      })
      if (calendarResponse.data.items?.length) {
        context.push(`Has active Google Calendar`)
      }

      // Get Gmail labels
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
      const labelsResponse = await gmail.users.labels.list({ userId: 'me' })
      if (labelsResponse.data.labels?.length) {
        context.push(`Uses Gmail with ${labelsResponse.data.labels.length} labels`)
      }
    } catch (error) {
      // Silent fail for context gathering
    }

    return context.length > 0 ? context.join(', ') : ''
  } catch (error) {
    return ''
  }
}
