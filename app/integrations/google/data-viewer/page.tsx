'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Mail,
  RefreshCw,
  CheckCircle,
  Workflow,
  Eye,
  Import
} from 'lucide-react'

interface GoogleData {
  drive: {
    count: number
    items: Array<{
      title: string
      description: string
      category: string
      steps: number
    }>
  }
  calendar: {
    count: number
    items: Array<{
      title: string
      description: string
      category: string
      steps: number
    }>
  }
  gmail: {
    count: number
    items: Array<{
      title: string
      description: string
      category: string
      steps: number
    }>
  }
}

export default function GoogleDataViewerPage() {
  const [data, setData] = useState<GoogleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/google/import')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('Failed to fetch Google data')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (selectedTypes.length === 0) return

    try {
      setImporting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/google/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ importTypes: selectedTypes }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`Successfully imported ${result.data.totalImported} workflows!`)
        setSelectedTypes([])
        // Refresh data after import
        setTimeout(() => fetchData(), 1000)
      } else {
        setError(result.error || 'Failed to import workflows')
      }
    } catch (err) {
      setError('An unexpected error occurred during import')
    } finally {
      setImporting(false)
    }
  }

  const toggleSelection = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-navy-600">Loading Google data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/integrations/google" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Google Integration
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
              <h1 className="text-3xl font-bold text-navy-900">Google Data Viewer</h1>
              <p className="text-navy-600">Preview and import your Google content as workflows</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button 
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              className="mr-3"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Card className="p-4 border-red-200 bg-red-50 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 text-red-600">⚠️</div>
              <p className="text-red-800">{error}</p>
            </div>
          </Card>
        )}

        {success && (
          <Card className="p-4 border-green-200 bg-green-50 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{success}</p>
            </div>
          </Card>
        )}

        {/* Data Overview */}
        {data && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-navy-900">Google Drive</h3>
                      <p className="text-sm text-navy-600">Documents & Files</p>
                    </div>
                  </div>
                  <Checkbox 
                    checked={selectedTypes.includes('drive')}
                    onCheckedChange={() => toggleSelection('drive')}
                    disabled={data.drive.count === 0}
                  />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-2">
                  {data.drive.count}
                </div>
                <p className="text-sm text-navy-600">
                  {data.drive.count === 0 ? 'No importable files found' : 'Files ready for import'}
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold text-navy-900">Google Calendar</h3>
                      <p className="text-sm text-navy-600">Events & Meetings</p>
                    </div>
                  </div>
                  <Checkbox 
                    checked={selectedTypes.includes('calendar')}
                    onCheckedChange={() => toggleSelection('calendar')}
                    disabled={data.calendar.count === 0}
                  />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-2">
                  {data.calendar.count}
                </div>
                <p className="text-sm text-navy-600">
                  {data.calendar.count === 0 ? 'No recurring events found' : 'Events ready for import'}
                </p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-8 h-8 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-navy-900">Gmail</h3>
                      <p className="text-sm text-navy-600">Labels & Filters</p>
                    </div>
                  </div>
                  <Checkbox 
                    checked={selectedTypes.includes('gmail')}
                    onCheckedChange={() => toggleSelection('gmail')}
                    disabled={data.gmail.count === 0}
                  />
                </div>
                <div className="text-3xl font-bold text-navy-900 mb-2">
                  {data.gmail.count}
                </div>
                <p className="text-sm text-navy-600">
                  {data.gmail.count === 0 ? 'No custom labels found' : 'Labels ready for import'}
                </p>
              </Card>
            </div>

            {/* Import Actions */}
            {(data.drive.count > 0 || data.calendar.count > 0 || data.gmail.count > 0) && (
              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 mb-2">Import Selected Data</h3>
                    <p className="text-navy-600">
                      {selectedTypes.length === 0 
                        ? 'Select data sources above to import as workflows'
                        : `${selectedTypes.length} data source(s) selected for import`
                      }
                    </p>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={selectedTypes.length === 0 || importing}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {importing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Import className="w-4 h-4 mr-2" />
                        Import Selected ({selectedTypes.length})
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* Detailed Data Views */}
            <div className="space-y-8">
              {/* Google Drive Items */}
              {data.drive.count > 0 && (
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-navy-900">Google Drive Files</h3>
                    <Badge className="bg-blue-100 text-blue-800">{data.drive.count} items</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.drive.items.map((item, index) => (
                      <div key={index} className="p-4 border border-navy-200 rounded-lg hover:border-violet-200 transition-colors">
                        <h4 className="font-medium text-navy-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-navy-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          <span className="text-xs text-navy-500">{item.steps} steps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Google Calendar Items */}
              {data.calendar.count > 0 && (
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-navy-900">Google Calendar Events</h3>
                    <Badge className="bg-emerald-100 text-emerald-800">{data.calendar.count} events</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.calendar.items.map((item, index) => (
                      <div key={index} className="p-4 border border-navy-200 rounded-lg hover:border-violet-200 transition-colors">
                        <h4 className="font-medium text-navy-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-navy-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          <span className="text-xs text-navy-500">{item.steps} steps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Gmail Items */}
              {data.gmail.count > 0 && (
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Mail className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-semibold text-navy-900">Gmail Labels</h3>
                    <Badge className="bg-red-100 text-red-800">{data.gmail.count} labels</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.gmail.items.map((item, index) => (
                      <div key={index} className="p-4 border border-navy-200 rounded-lg hover:border-violet-200 transition-colors">
                        <h4 className="font-medium text-navy-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-navy-600 mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{item.category}</Badge>
                          <span className="text-xs text-navy-500">{item.steps} steps</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* No Data Message */}
              {data.drive.count === 0 && data.calendar.count === 0 && data.gmail.count === 0 && (
                <Card className="p-8 text-center">
                  <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-navy-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">No Importable Content Found</h3>
                  <p className="text-navy-600 mb-6">
                    Create some documents, calendar events, or email labels in your Google account, then refresh this page to see importable workflows.
                  </p>
                  <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
