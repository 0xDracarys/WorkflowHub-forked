'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft,
  Settings,
  Workflow,
  Link as LinkIcon,
  Unlink,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function GoogleIntegrationPage() {
  const { user, isLoaded } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [authUrl, setAuthUrl] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      
      if (result.success) {
        setUserProfile(result.data)
        setIsConnected(!!result.data?.googleTokens?.accessToken)
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const connectGoogleAccount = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/google/auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        // Open Google OAuth in new window
        window.open(result.data.authUrl, '_blank', 'width=500,height=600')
        setSuccess('Please complete the authorization in the popup window.')
      } else {
        setError(result.error || 'Failed to get Google OAuth URL')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const disconnectGoogleAccount = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/google/auth', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        setIsConnected(false)
        setUserProfile(prev => ({ ...prev, googleTokens: null }))
        setSuccess('Google account disconnected successfully.')
      } else {
        setError(result.error || 'Failed to disconnect Google account')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testUserAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/users', {
        method: 'GET',
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('User API is working! Check console for user data.')
        console.log('User data:', result.data)
      } else {
        setError(result.error || 'Failed to fetch user data')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const userData = {
        email: user?.emailAddresses[0]?.emailAddress || 'test@example.com',
        firstName: user?.firstName || 'Test',
        lastName: user?.lastName || 'User',
        username: user?.username || undefined,
        imageUrl: user?.imageUrl || undefined,
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('User profile created successfully!')
        console.log('Created user:', result.data)
      } else {
        setError(result.error || 'Failed to create user profile')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <Card className="p-8 border-navy-100 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-navy-600" />
            </div>
            <h2 className="text-xl font-bold text-navy-900 mb-2">Authentication Required</h2>
            <p className="text-navy-600 mb-6">
              Please sign in to access Google integration settings.
            </p>
            <Link href="/auth">
              <Button className="bg-violet-600 hover:bg-violet-700">
                Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-navy-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 text-navy-600 hover:text-violet-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
              
              <div className="w-px h-6 bg-navy-200"></div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-navy-700 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
                  Google Integration
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Google Integration</h1>
          <p className="text-navy-600">
            Connect your Google account to enable powerful integrations with Google Drive, Sheets, and more.
          </p>
        </div>

        {error && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </Card>
        )}

        {success && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {/* Connection Status */}
          <Card className="p-6 border-navy-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-navy-900 mb-2">Connection Status</h2>
                <p className="text-navy-600">
                  {isConnected ? 'Your Google account is connected and ready to use.' : 'Connect your Google account to enable integrations.'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-700">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Button 
                  onClick={disconnectGoogleAccount}
                  disabled={loading}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  {loading ? 'Disconnecting...' : 'Disconnect Google Account'}
                </Button>
              ) : (
                <Button 
                  onClick={connectGoogleAccount}
                  disabled={loading}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {loading ? 'Connecting...' : 'Connect Google Account'}
                </Button>
              )}
            </div>
          </Card>

          {/* Available Integrations */}
          <Card className="p-6 border-navy-100">
            <h2 className="text-xl font-semibold text-navy-900 mb-4">Available Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Google Drive',
                  description: 'Store and manage workflow documents',
                  icon: '📁',
                  status: isConnected ? 'Available' : 'Requires Connection'
                },
                {
                  name: 'Google Sheets',
                  description: 'Export data and create reports',
                  icon: '📊', 
                  status: isConnected ? 'Available' : 'Requires Connection'
                },
                {
                  name: 'Google Calendar',
                  description: 'Schedule meetings and reminders',
                  icon: '📅',
                  status: isConnected ? 'Available' : 'Requires Connection'
                },
                {
                  name: 'Gmail',
                  description: 'Send automated emails',
                  icon: '✉️',
                  status: isConnected ? 'Available' : 'Requires Connection'
                },
                {
                  name: 'Google Forms',
                  description: 'Create intake forms',
                  icon: '📋',
                  status: 'Coming Soon'
                },
                {
                  name: 'Google Docs',
                  description: 'Generate documents',
                  icon: '📄',
                  status: 'Coming Soon'
                }
              ].map((integration, index) => (
                <div key={index} className="p-4 border border-navy-200 rounded-lg hover:border-violet-200 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{integration.icon}</span>
                    <h3 className="font-semibold text-navy-900">{integration.name}</h3>
                  </div>
                  <p className="text-sm text-navy-600 mb-3">{integration.description}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      integration.status === 'Available' 
                        ? 'border-green-200 text-green-700' 
                        : integration.status === 'Coming Soon'
                        ? 'border-gray-200 text-gray-600'
                        : 'border-orange-200 text-orange-700'
                    }`}
                  >
                    {integration.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Account Information */}
          {isConnected && userProfile && (
            <Card className="p-6 border-navy-100">
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-navy-700">Email</label>
                  <p className="text-navy-900">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-700">Name</label>
                  <p className="text-navy-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-700">Google Scope</label>
                  <p className="text-navy-900 text-sm">
                    {userProfile.googleTokens?.scope || 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-navy-700">Connection Date</label>
                  <p className="text-navy-900 text-sm">
                    {userProfile.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
