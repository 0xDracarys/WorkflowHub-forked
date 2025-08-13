import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getGoogleAuthUrl, getTokensFromCode } from '@/lib/google-integration'
import { UserAPI } from '@/lib/user-api'

// GET /api/google/auth - Get Google OAuth URL
export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const authUrl = getGoogleAuthUrl(clerkId)
    
    return NextResponse.json({
      success: true,
      data: { authUrl },
      message: 'Google OAuth URL generated'
    })
  } catch (error) {
    console.error('GET /api/google/auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/google/auth - Exchange auth code for tokens
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { code, state } = await request.json()
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Verify state matches clerkId (optional security check)
    if (state && state !== clerkId) {
      return NextResponse.json(
        { success: false, error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code)
    
    if (!tokens.access_token) {
      return NextResponse.json(
        { success: false, error: 'Failed to get access token' },
        { status: 400 }
      )
    }

    // Format tokens for database storage
    const googleTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      scope: tokens.scope || '',
      tokenType: tokens.token_type || 'Bearer',
      expiryDate: tokens.expiry_date || Date.now() + (3600 * 1000) // 1 hour default
    }

    // Update user with Google tokens
    const result = await UserAPI.updateGoogleTokens(clerkId, googleTokens)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Google account connected successfully',
      data: {
        scope: googleTokens.scope,
        expiryDate: googleTokens.expiryDate
      }
    })
  } catch (error) {
    console.error('POST /api/google/auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to connect Google account' },
      { status: 500 }
    )
  }
}

// DELETE /api/google/auth - Disconnect Google account
export async function DELETE() {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remove Google tokens from user
    const result = await UserAPI.updateGoogleTokens(clerkId, undefined)
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Google account disconnected successfully'
    })
  } catch (error) {
    console.error('DELETE /api/google/auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to disconnect Google account' },
      { status: 500 }
    )
  }
}
