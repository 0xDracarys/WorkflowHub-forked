# Google Cloud Setup for WorkflowHub Platform

## Platform Owner Setup (You do this once)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project called "WorkflowHub-Platform"
3. Enable the following APIs:
   - Google Drive API
   - Gmail API
   - Google Sheets API
   - Google Calendar API
   - Google Docs API

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the API & Services section
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: "WorkflowHub OAuth Client"
5. Authorized redirect URIs:
   - `http://localhost:3000/api/google/callback` (development)
   - `https://your-domain.com/api/google/callback` (production)

### Step 3: Configure OAuth Consent Screen
1. Go to "OAuth consent screen"
2. User type: "External" (for public access)
3. Fill in:
   - App name: "WorkflowHub"
   - User support email: your-email@domain.com
   - Logo: Your platform logo
   - App domain: https://your-domain.com
   - Developer contact: your-email@domain.com
4. Add scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/documents`
   - `userinfo.email`
   - `userinfo.profile`

### Step 4: Add Environment Variables
Add these to your `.env.local`:

```env
# Google OAuth (Platform-managed)
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback

# For production, use:
# GOOGLE_REDIRECT_URI=https://your-domain.com/api/google/callback
```

## What Influencers See
- Simple "Connect Google Account" button
- Standard Google OAuth consent screen
- They grant permissions to YOUR app (WorkflowHub)
- No API keys or technical setup required for them
