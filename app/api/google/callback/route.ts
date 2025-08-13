import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { UserAPI } from '@/lib/user-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This should be the clerkId
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=google_auth_failed`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=missing_parameters`)
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    if (!tokens.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=no_access_token`)
    }

    // Save tokens to user profile
    const tokenData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      scope: tokens.scope || '',
      tokenType: tokens.token_type || 'Bearer',
      expiryDate: tokens.expiry_date || Date.now() + 3600000 // 1 hour default
    }

    const result = await UserAPI.updateGoogleTokens(state, tokenData)
    
    if (result.success) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=google_connected`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=failed_to_save_tokens`)
    }
  } catch (error) {
    console.error('Google callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?error=callback_error`)
  }
}
