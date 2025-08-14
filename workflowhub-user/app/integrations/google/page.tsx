'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Mail,
  BarChart3,
  FileSpreadsheet,
  Users,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface ConnectionTestResults {
  tokenInfo: {
    accessToken: boolean
    refreshToken: boolean
    expired: boolean
    scope: string[]
  }
  userInfo: {
    success: boolean
    email?: string
    name?: string
    error?: string
  }
  googleDrive: {
    success: boolean
    count: number
    files?: any[]
    error?: string
  }
  googleCalendar: {
    success: boolean
    count: number
    events?: any[]
    error?: string
  }
  gmail: {
    success: boolean
    count: number
    labels?: any[]
    error?: string
  }
}

export default function GoogleIntegrationPage() {
  const [testResults, setTestResults] = useState<ConnectionTestResults | null>(null)
  const [testing, setTesting] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Run connection test on load
    testConnection()
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch('/api/integrations/google/test')
      const data = await response.json()
      setTestResults(data)
      setConnected(data.tokenInfo?.accessToken && !data.tokenInfo?.expired)
    } catch (error) {
      console.error('Failed to test connection:', error)
    } finally {
      setTesting(false)
    }
  }

  const StatusIcon = ({ success }: { success: boolean }) => {
    if (success) return <CheckCircle className="w-4 h-4 text-emerald-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Google Integration</h1>
              <p className="text-navy-600">Connect your Google services to automate workflows</p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Google Drive */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-navy-900">Google Drive</h3>
                  <p className="text-sm text-navy-600">Store and manage workflow documents</p>
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 mb-2">Available</Badge>
            <p className="text-sm text-navy-600 mb-4">
              {testResults?.googleDrive.success 
                ? `${testResults.googleDrive.count} files found`
                : 'Connection test pending...'
              }
            </p>
            <div className="space-y-2">
              <div className="text-sm text-navy-600">📄 Documents, Sheets & Slides</div>
              <div className="text-sm text-navy-600">📁 Folders & File organization</div>
              <div className="text-sm text-navy-600">🔄 Real-time sync & collaboration</div>
            </div>
          </Card>

          {/* Google Calendar */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="font-semibold text-navy-900">Google Calendar</h3>
                  <p className="text-sm text-navy-600">Schedule meetings and reminders</p>
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 mb-2">Available</Badge>
            <p className="text-sm text-navy-600 mb-4">
              {testResults?.googleCalendar.success 
                ? `${testResults.googleCalendar.count} events found`
                : 'Connection test pending...'
              }
            </p>
            <div className="space-y-2">
              <div className="text-sm text-navy-600">📅 Meeting automation</div>
              <div className="text-sm text-navy-600">🔔 Smart notifications</div>
              <div className="text-sm text-navy-600">👥 Team coordination</div>
            </div>
          </Card>

          {/* Gmail */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold text-navy-900">Gmail</h3>
                  <p className="text-sm text-navy-600">Send automated emails</p>
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 mb-2">Available</Badge>
            <p className="text-sm text-navy-600 mb-4">
              {testResults?.gmail.success 
                ? `${testResults.gmail.count} labels found`
                : 'Connection test pending...'
              }
            </p>
            <div className="space-y-2">
              <div className="text-sm text-navy-600">📧 Email automation</div>
              <div className="text-sm text-navy-600">🏷️ Smart labeling</div>
              <div className="text-sm text-navy-600">📊 Analytics & tracking</div>
            </div>
          </Card>
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 opacity-75">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-8 h-8 text-orange-600" />
              <div>
                <h3 className="font-semibold text-navy-900">Google Forms</h3>
                <p className="text-sm text-navy-600">Create intake forms</p>
              </div>
            </div>
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
          </Card>

          <Card className="p-6 opacity-75">
            <div className="flex items-center space-x-3 mb-4">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-navy-900">Google Docs</h3>
                <p className="text-sm text-navy-600">Generate documents</p>
              </div>
            </div>
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
          </Card>

          <Card className="p-6 opacity-75">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="font-semibold text-navy-900">Google Meet</h3>
                <p className="text-sm text-navy-600">Video conferencing</p>
              </div>
            </div>
            <Badge variant="outline" className="mb-4">Coming Soon</Badge>
          </Card>
        </div>

        {/* Import Existing Workflows */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">Import Existing Workflows</h3>
              <p className="text-navy-600">We found content in your Google account that can be converted into workflows.</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/integrations/google/data-viewer">
                <Button variant="outline" className="text-violet-600 border-violet-200 hover:bg-violet-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Data
                </Button>
              </Link>
              <Button 
                onClick={testConnection}
                disabled={testing}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {testing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Google Drive */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">Google Drive</h4>
                </div>
              </div>
              <div className="text-3xl font-bold text-navy-900 mb-2">
                {testResults?.googleDrive.count || 0}
              </div>
              <p className="text-sm text-navy-600 mb-4">Documents, Sheets & Slides</p>
              {testResults?.googleDrive.count === 0 && (
                <p className="text-sm text-navy-500 italic mb-4">
                  No importable content found. Create some documents, calendar events, or email labels in your Google account, then refresh this page.
                </p>
              )}
            </Card>

            {/* Calendar Events */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">Calendar Events</h4>
                </div>
              </div>
              <div className="text-3xl font-bold text-navy-900 mb-2">
                {testResults?.googleCalendar.count || 0}
              </div>
              <p className="text-sm text-navy-600 mb-4">Recurring meetings & events</p>
              {testResults?.googleCalendar.count === 0 && (
                <p className="text-sm text-navy-500 italic mb-4">
                  No importable content found. Create some documents, calendar events, or email labels in your Google account, then refresh this page.
                </p>
              )}
            </Card>

            {/* Gmail Labels */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900">Gmail Labels</h4>
                </div>
              </div>
              <div className="text-3xl font-bold text-navy-900 mb-2">
                {testResults?.gmail.count || 0}
              </div>
              <p className="text-sm text-navy-600 mb-4">Email organization systems</p>
              {testResults?.gmail.count === 0 && (
                <p className="text-sm text-navy-500 italic mb-4">
                  No importable content found. Create some documents, calendar events, or email labels in your Google account, then refresh this page.
                </p>
              )}
            </Card>
          </div>

          {connected && (testResults?.googleDrive.count || 0) + (testResults?.googleCalendar.count || 0) + (testResults?.gmail.count || 0) > 0 && (
            <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-violet-900">Ready to import your data!</h4>
                  <p className="text-sm text-violet-700">
                    Click "View All Data" to explore your Google content and create workflows.
                  </p>
                </div>
                <Link href="/integrations/google/data-viewer">
                  <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                    Import Workflows
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Connection Test Results */}
        {testResults && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-navy-900">Connection Test Results</h3>
              <Button 
                onClick={testConnection}
                disabled={testing}
                variant="outline"
                size="sm"
              >
                {testing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Retest
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-navy-900">Token Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Access Token:</span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={testResults.tokenInfo.accessToken} />
                      <span className="text-sm">{testResults.tokenInfo.accessToken ? 'Present' : 'Missing'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Refresh Token:</span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={testResults.tokenInfo.refreshToken} />
                      <span className="text-sm">{testResults.tokenInfo.refreshToken ? 'Present' : 'Missing'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-navy-600">Expired:</span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={!testResults.tokenInfo.expired} />
                      <span className="text-sm">{testResults.tokenInfo.expired ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                {testResults.tokenInfo.scope && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-navy-700 mb-2">Authorized Scopes:</h5>
                    <div className="space-y-1">
                      {testResults.tokenInfo.scope.map((scope, index) => (
                        <div key={index} className="text-xs bg-navy-50 px-2 py-1 rounded">
                          {scope}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service Tests */}
              <div className="space-y-4">
                <h4 className="font-medium text-navy-900">Service Tests</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Google Drive</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={testResults.googleDrive.success} />
                      <span className="text-sm">{testResults.googleDrive.success ? `Success (${testResults.googleDrive.count} files)` : 'Failed'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium">Google Calendar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={testResults.googleCalendar.success} />
                      <span className="text-sm">{testResults.googleCalendar.success ? `Success (${testResults.googleCalendar.count} events)` : 'Failed'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium">Gmail</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon success={testResults.gmail.success} />
                      <span className="text-sm">{testResults.gmail.success ? `Success (${testResults.gmail.count} labels)` : 'Failed'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            {testResults.userInfo.email && (
              <div className="mt-6 pt-6 border-t border-navy-100">
                <h4 className="font-medium text-navy-900 mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-navy-600">Email:</span>
                    <p className="font-medium">{testResults.userInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-navy-600">Name:</span>
                    <p className="font-medium">{testResults.userInfo.name || 'Not available'}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
