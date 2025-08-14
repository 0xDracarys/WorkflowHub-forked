'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Download,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Eye,
  Edit
} from 'lucide-react'
import { AIWorkflowBuilder } from '@/components/AIWorkflowBuilder'
import Link from 'next/link'

interface Workflow {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  isTemplate: boolean
  generatedByAI?: boolean
  aiModel?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  usageCount: number
  rating: number
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive' | 'draft'
}

interface WorkflowStats {
  total: number
  active: number
  templates: number
  aiGenerated: number
  drafts: number
}

export default function WorkflowManagePage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<WorkflowStats | null>(null)
  const [showAIBuilder, setShowAIBuilder] = useState(false)
  const [bulkOperating, setBulkOperating] = useState(false)

  useEffect(() => {
    fetchWorkflows()
    fetchStats()
  }, [])

  const fetchWorkflows = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/workflows?type=user')
      const data = await response.json()
      if (data.success) {
        setWorkflows(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/workflows/bulk')
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleSelectWorkflow = (workflowId: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(workflowId) 
        ? prev.filter(id => id !== workflowId)
        : [...prev, workflowId]
    )
  }

  const handleSelectAll = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([])
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedWorkflows.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedWorkflows.length} workflows? This action cannot be undone.`)) {
      return
    }

    setBulkOperating(true)
    try {
      const response = await fetch('/api/workflows/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'delete',
          workflowIds: selectedWorkflows
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchWorkflows()
        await fetchStats()
        setSelectedWorkflows([])
        alert(`Successfully deleted ${selectedWorkflows.length} workflows`)
      } else {
        alert(`Failed to delete workflows: ${data.error}`)
      }
    } catch (error) {
      console.error('Bulk delete failed:', error)
      alert('Failed to delete workflows')
    } finally {
      setBulkOperating(false)
    }
  }

  const handleCleanupTemplates = async () => {
    if (!confirm('Are you sure you want to delete all template and demo workflows? This will clean up your workspace but cannot be undone.')) {
      return
    }

    setBulkOperating(true)
    try {
      const response = await fetch('/api/workflows/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cleanup_templates'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchWorkflows()
        await fetchStats()
        alert(`Successfully cleaned up ${data.deletedCount || 0} template workflows`)
      } else {
        alert(`Failed to cleanup templates: ${data.error}`)
      }
    } catch (error) {
      console.error('Template cleanup failed:', error)
      alert('Failed to cleanup templates')
    } finally {
      setBulkOperating(false)
    }
  }

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return
    }

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchWorkflows()
        await fetchStats()
        alert('Workflow deleted successfully')
      } else {
        alert(`Failed to delete workflow: ${data.error}`)
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete workflow')
    }
  }

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || workflow.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(workflows.map(w => w.category))]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'draft':
        return <Clock className="w-4 h-4 text-orange-600" />
      default:
        return <Settings className="w-4 h-4 text-gray-600" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-orange-100 text-orange-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showAIBuilder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy-900">Create Workflow with AI</h1>
              <p className="text-navy-600 mt-2">Let Gemini AI help you build intelligent workflows</p>
            </div>
            <Button 
              onClick={() => setShowAIBuilder(false)}
              variant="outline"
            >
              Back to Management
            </Button>
          </div>
          
          <AIWorkflowBuilder 
            onWorkflowGenerated={(workflow) => {
              console.log('Generated workflow:', workflow)
              fetchWorkflows() // Refresh the list
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-900">Workflow Management</h1>
            <p className="text-navy-600 mt-2">Manage, edit, and organize your automation workflows</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => setShowAIBuilder(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Builder
            </Button>
            <Link href="/workflows/create">
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-navy-900">{stats.total}</div>
              <div className="text-sm text-navy-600">Total Workflows</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-navy-600">Active</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
              <div className="text-sm text-navy-600">Drafts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.templates}</div>
              <div className="text-sm text-navy-600">Templates</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.aiGenerated}</div>
              <div className="text-sm text-navy-600">AI Generated</div>
            </Card>
          </div>
        )}

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {categories.length > 0 && (
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-navy-200 rounded-lg text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {selectedWorkflows.length > 0 && (
                <>
                  <Button
                    onClick={handleBulkDelete}
                    disabled={bulkOperating}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Selected ({selectedWorkflows.length})
                  </Button>
                </>
              )}
              
              <Button
                onClick={handleCleanupTemplates}
                disabled={bulkOperating}
                variant="outline"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Cleanup Templates
              </Button>
            </div>
          </div>
        </Card>

        {/* Workflows List */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedWorkflows.length === filteredWorkflows.length && filteredWorkflows.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <h3 className="text-lg font-semibold text-navy-900">
                  Workflows ({filteredWorkflows.length})
                </h3>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-navy-600">Loading workflows...</div>
            ) : filteredWorkflows.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="w-16 h-16 mx-auto mb-4 text-navy-300" />
                <h3 className="text-lg font-semibold text-navy-900 mb-2">No workflows found</h3>
                <p className="text-navy-600 mb-4">Get started by creating your first workflow</p>
                <Button 
                  onClick={() => setShowAIBuilder(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Create with AI
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredWorkflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-navy-100 hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedWorkflows.includes(workflow.id)}
                        onCheckedChange={() => handleSelectWorkflow(workflow.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-navy-900 truncate">{workflow.name}</h4>
                          {workflow.generatedByAI && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                          {workflow.isTemplate && (
                            <Badge variant="outline" className="text-xs">Template</Badge>
                          )}
                        </div>
                        <p className="text-sm text-navy-600 truncate max-w-md">{workflow.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(workflow.status)}
                            <span className="text-xs text-navy-500">{workflow.status}</span>
                          </div>
                          <Badge className={`text-xs ${getDifficultyColor(workflow.difficulty)}`}>
                            {workflow.difficulty}
                          </Badge>
                          <span className="text-xs text-navy-500">{workflow.estimatedTime}</span>
                          <span className="text-xs text-navy-500">{workflow.usageCount} uses</span>
                          {workflow.aiModel && (
                            <Badge variant="outline" className="text-xs">
                              {workflow.aiModel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/workflows/${workflow.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/workflows/${workflow.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
