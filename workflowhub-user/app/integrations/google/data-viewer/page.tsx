'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Calendar, 
  Mail, 
  Download, 
  Eye, 
  ChevronRight,
  Folder,
  Clock,
  User,
  Tag,
  Brain,
  Sparkles
} from 'lucide-react'
import { AIWorkflowBuilder } from '@/components/AIWorkflowBuilder'

interface GoogleFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime: string
  webViewLink?: string
  owners?: Array<{ displayName: string }>
}

interface GoogleEvent {
  id: string
  summary: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  attendees?: Array<{ email: string }>
  location?: string
  description?: string
}

interface GmailLabel {
  id: string
  name: string
  type: string
  messagesTotal?: number
  messagesUnread?: number
}

export default function GoogleDataViewer() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    files: GoogleFile[]
    events: GoogleEvent[]
    labels: GmailLabel[]
  }>({
    files: [],
    events: [],
    labels: []
  })

  const fetchGoogleData = async () => {
    setLoading(true)
    try {
      // Fetch Drive files
      const filesResponse = await fetch('/api/integrations/google/drive/files')
      const filesData = await filesResponse.json()
      
      // Fetch Calendar events
      const eventsResponse = await fetch('/api/integrations/google/calendar/events')
      const eventsData = await eventsResponse.json()
      
      // Fetch Gmail labels
      const labelsResponse = await fetch('/api/integrations/google/gmail/labels')
      const labelsData = await labelsResponse.json()

      setData({
        files: filesData.files || [],
        events: eventsData.events || [],
        labels: labelsData.labels || []
      })
    } catch (error) {
      console.error('Failed to fetch Google data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoogleData()
  }, [])

  const formatFileSize = (bytes: string | number) => {
    if (!bytes) return 'Unknown'
    const size = typeof bytes === 'string' ? parseInt(bytes) : bytes
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getMimeTypeIcon = (mimeType: string) => {
    if (mimeType.includes('document')) return '📄'
    if (mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('presentation')) return '📈'
    if (mimeType.includes('image')) return '🖼️'
    if (mimeType.includes('video')) return '🎥'
    if (mimeType.includes('audio')) return '🎵'
    if (mimeType.includes('folder')) return '📁'
    return '📄'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Google Data Viewer</h1>
            <p className="text-navy-600 mt-2">Explore and import your Google data for workflow automation</p>
          </div>
          <Button 
            onClick={fetchGoogleData}
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Data Tabs */}
        <Tabs defaultValue="drive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drive" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Google Drive ({data.files.length})</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Calendar ({data.events.length})</span>
            </TabsTrigger>
            <TabsTrigger value="gmail" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Gmail ({data.labels.length})</span>
            </TabsTrigger>
            <TabsTrigger value="ai-builder" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI Builder</span>
            </TabsTrigger>
          </TabsList>

          {/* Google Drive Tab */}
          <TabsContent value="drive" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Google Drive Files</h3>
                <Badge variant="outline">{data.files.length} files</Badge>
              </div>
              
              <div className="space-y-3">
                {data.files.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-navy-100 hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getMimeTypeIcon(file.mimeType)}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-navy-900 truncate">{file.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-navy-600 mt-1">
                          <span>{file.mimeType.split('/')[1] || 'Unknown'}</span>
                          {file.size && <span>{formatFileSize(file.size)}</span>}
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(file.modifiedTime)}</span>
                          </span>
                          {file.owners?.[0] && (
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{file.owners[0].displayName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {file.webViewLink && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(file.webViewLink, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-violet-600 border-violet-200 hover:bg-violet-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Import
                      </Button>
                    </div>
                  </div>
                ))}
                
                {data.files.length === 0 && !loading && (
                  <div className="text-center py-8 text-navy-600">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-navy-300" />
                    <p>No files found in your Google Drive</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Google Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Calendar Events</h3>
                <Badge variant="outline">{data.events.length} events</Badge>
              </div>
              
              <div className="space-y-3">
                {data.events.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-navy-100 hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-navy-900 truncate">{event.summary}</h4>
                        <div className="flex items-center space-x-4 text-sm text-navy-600 mt-1">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {event.start.dateTime 
                                ? formatDateTime(event.start.dateTime)
                                : new Date(event.start.date!).toLocaleDateString()
                              }
                            </span>
                          </span>
                          {event.location && (
                            <span className="truncate max-w-xs">{event.location}</span>
                          )}
                          {event.attendees && (
                            <span>{event.attendees.length} attendees</span>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-navy-500 mt-1 truncate max-w-md">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-violet-600 border-violet-200 hover:bg-violet-50"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Import
                      </Button>
                    </div>
                  </div>
                ))}
                
                {data.events.length === 0 && !loading && (
                  <div className="text-center py-8 text-navy-600">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-navy-300" />
                    <p>No events found in your Google Calendar</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Gmail Tab */}
          <TabsContent value="gmail" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Gmail Labels</h3>
                <Badge variant="outline">{data.labels.length} labels</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.labels.map((label) => (
                  <Card 
                    key={label.id} 
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-violet-600" />
                        <h4 className="font-medium text-navy-900 truncate">{label.name}</h4>
                      </div>
                      <Badge 
                        variant={label.type === 'system' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {label.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-navy-600">
                      {label.messagesTotal !== undefined && (
                        <div className="flex justify-between">
                          <span>Total Messages:</span>
                          <span className="font-medium">{label.messagesTotal}</span>
                        </div>
                      )}
                      {label.messagesUnread !== undefined && (
                        <div className="flex justify-between">
                          <span>Unread:</span>
                          <span className="font-medium text-orange-600">{label.messagesUnread}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3 text-violet-600 border-violet-200 hover:bg-violet-50"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Import Messages
                    </Button>
                  </Card>
                ))}
                
                {data.labels.length === 0 && !loading && (
                  <div className="col-span-full text-center py-8 text-navy-600">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-navy-300" />
                    <p>No labels found in your Gmail</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* AI Workflow Builder Tab */}
          <TabsContent value="ai-builder" className="space-y-4">
            <AIWorkflowBuilder 
              onWorkflowGenerated={(workflow) => {
                console.log('Generated workflow from Google data:', workflow)
                // You could add navigation here to view the created workflow
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Workflow Creation Suggestions */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Suggested Workflows</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h4 className="font-medium text-violet-900 mb-2">📄 Document Processing</h4>
              <p className="text-sm text-violet-700 mb-3">
                Automatically process new Google Docs and extract key information
              </p>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                Create Workflow
              </Button>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-medium text-emerald-900 mb-2">📅 Meeting Automation</h4>
              <p className="text-sm text-emerald-700 mb-3">
                Send automatic follow-ups after calendar events
              </p>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Create Workflow
              </Button>
            </div>
            
            <div className="p-4 bg-navy-50 rounded-lg border border-navy-200">
              <h4 className="font-medium text-navy-900 mb-2">📧 Email Organization</h4>
              <p className="text-sm text-navy-700 mb-3">
                Automatically organize emails based on labels and content
              </p>
              <Button size="sm" className="bg-navy-600 hover:bg-navy-700">
                Create Workflow
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
