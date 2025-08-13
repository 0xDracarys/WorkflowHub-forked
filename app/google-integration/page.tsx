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
  const [importPreview, setImportPreview] = useState<any>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

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
        const connected = !!result.data?.googleTokens?.accessToken
        setIsConnected(connected)
        
        // If newly connected, automatically preview import options
        if (connected && !importPreview) {
          previewImport()
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
    }
  }

  const previewImport = async () => {
    try {
      const response = await fetch('/api/google/import')
      const result = await response.json()
      
      if (result.success) {
        setImportPreview(result.data)
      }
    } catch (err) {
      console.error('Error previewing import:', err)
    }
  }

  const importWorkflows = async (importTypes: string[]) => {
    try {
      setIsImporting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/google/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ importTypes }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`Successfully imported ${result.data.totalImported} workflows!`)
        setShowImportModal(false)
        // Refresh the preview to show updated counts
        setTimeout(() => previewImport(), 1000)
      } else {
        setError(result.error || 'Failed to import workflows')
      }
    } catch (err) {
      setError('An unexpected error occurred during import')
      console.error('Error importing workflows:', err)
    } finally {
      setIsImporting(false)
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

          {/* Workflow Import */}
          {isConnected && importPreview && (
            <Card className="p-6 border-navy-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-navy-900 mb-2">Import Existing Workflows</h2>
                  <p className="text-navy-600">
                    We found content in your Google account that can be converted into workflows.
                  </p>
                </div>
                <Button
                  onClick={() => setShowImportModal(true)}
                  className="bg-violet-600 hover:bg-violet-700"
                  disabled={!importPreview || (importPreview.drive.count + importPreview.calendar.count + importPreview.gmail.count === 0)}
                >
                  <Workflow className="w-4 h-4 mr-2" />
                  Import Workflows
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-navy-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">📁</span>
                    <h3 className="font-semibold text-navy-900">Google Drive</h3>
                  </div>
                  <p className="text-2xl font-bold text-violet-600">{importPreview.drive.count}</p>
                  <p className="text-sm text-navy-600">Documents, Sheets & Slides</p>
                </div>

                <div className="p-4 border border-navy-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">📅</span>
                    <h3 className="font-semibold text-navy-900">Calendar Events</h3>
                  </div>
                  <p className="text-2xl font-bold text-violet-600">{importPreview.calendar.count}</p>
                  <p className="text-sm text-navy-600">Recurring meetings & events</p>
                </div>

                <div className="p-4 border border-navy-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">✉️</span>
                    <h3 className="font-semibold text-navy-900">Gmail Labels</h3>
                  </div>
                  <p className="text-2xl font-bold text-violet-600">{importPreview.gmail.count}</p>
                  <p className="text-sm text-navy-600">Email organization systems</p>
                </div>
              </div>

              {(importPreview.drive.count + importPreview.calendar.count + importPreview.gmail.count === 0) && (
                <div className="mt-4 p-4 bg-navy-50 rounded-lg">
                  <p className="text-navy-600 text-center">
                    No importable content found. Create some documents, calendar events, or email labels in your Google account, then refresh this page.
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Import Modal */}
          {showImportModal && importPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-navy-900">Select What to Import</h3>
                  <Button
                    onClick={() => setShowImportModal(false)}
                    variant="ghost"
                    size="sm"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {importPreview.drive.count > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="import-drive"
                          className="w-4 h-4 text-violet-600 border-navy-300 rounded focus:ring-violet-500"
                        />
                        <label htmlFor="import-drive" className="font-medium text-navy-900">
                          Google Drive ({importPreview.drive.count} items)
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {importPreview.drive.items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="p-2 bg-navy-50 rounded text-sm">
                            <div className="font-medium text-navy-900">{item.title}</div>
                            <div className="text-navy-600">{item.steps} steps • {item.category}</div>
                          </div>
                        ))}
                        {importPreview.drive.items.length > 3 && (
                          <div className="text-sm text-navy-500 ml-2">
                            +{importPreview.drive.items.length - 3} more items
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {importPreview.calendar.count > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="import-calendar"
                          className="w-4 h-4 text-violet-600 border-navy-300 rounded focus:ring-violet-500"
                        />
                        <label htmlFor="import-calendar" className="font-medium text-navy-900">
                          Google Calendar ({importPreview.calendar.count} events)
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {importPreview.calendar.items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="p-2 bg-navy-50 rounded text-sm">
                            <div className="font-medium text-navy-900">{item.title}</div>
                            <div className="text-navy-600">{item.steps} steps • {item.category}</div>
                          </div>
                        ))}
                        {importPreview.calendar.items.length > 3 && (
                          <div className="text-sm text-navy-500 ml-2">
                            +{importPreview.calendar.items.length - 3} more events
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {importPreview.gmail.count > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="import-gmail"
                          className="w-4 h-4 text-violet-600 border-navy-300 rounded focus:ring-violet-500"
                        />
                        <label htmlFor="import-gmail" className="font-medium text-navy-900">
                          Gmail Labels ({importPreview.gmail.count} labels)
                        </label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {importPreview.gmail.items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="p-2 bg-navy-50 rounded text-sm">
                            <div className="font-medium text-navy-900">{item.title}</div>
                            <div className="text-navy-600">{item.steps} steps • {item.category}</div>
                          </div>
                        ))}
                        {importPreview.gmail.items.length > 3 && (
                          <div className="text-sm text-navy-500 ml-2">
                            +{importPreview.gmail.items.length - 3} more labels
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6">
                  <Button
                    onClick={() => setShowImportModal(false)}
                    variant="outline"
                    disabled={isImporting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const selectedTypes = []
                      if (document.getElementById('import-drive')?.checked) selectedTypes.push('drive')
                      if (document.getElementById('import-calendar')?.checked) selectedTypes.push('calendar')
                      if (document.getElementById('import-gmail')?.checked) selectedTypes.push('gmail')
                      if (selectedTypes.length > 0) {
                        importWorkflows(selectedTypes)
                      }
                    }}
                    disabled={isImporting}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {isImporting ? 'Importing...' : 'Import Selected'}
                  </Button>
                </div>
              </Card>
            </div>
          )}

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
