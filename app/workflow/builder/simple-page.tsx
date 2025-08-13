"use client"

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Workflow, 
  ArrowLeft, 
  Plus, 
  Save, 
  Eye, 
  CheckCircle,
  Settings,
  Trash2,
  Edit
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface WorkflowStep {
  id: string
  title: string
  description: string
  type: 'action' | 'condition' | 'loop' | 'delay' | 'integration'
  config: Record<string, any>
  position: { x: number; y: number }
  connections: string[]
}

interface WorkflowData {
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  steps: WorkflowStep[]
}

export default function WorkflowBuilderPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const workflowId = searchParams.get('id')
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [workflow, setWorkflow] = useState<WorkflowData>({
    title: '',
    description: '',
    category: '',
    tags: [''],
    isPublic: false,
    steps: []
  })

  const categories = [
    'Automation',
    'Marketing',
    'Sales',
    'Customer Support',
    'HR & Recruiting',
    'Finance',
    'Project Management',
    'Content Creation',
    'Data Processing',
    'Lead Generation'
  ]

  const stepTypes = [
    { id: 'action', name: 'Action', color: 'bg-blue-500', description: 'Perform a specific task' },
    { id: 'condition', name: 'Condition', color: 'bg-yellow-500', description: 'Make a decision based on criteria' },
    { id: 'loop', name: 'Loop', color: 'bg-purple-500', description: 'Repeat actions' },
    { id: 'delay', name: 'Delay', color: 'bg-gray-500', description: 'Wait for a specified time' },
    { id: 'integration', name: 'Integration', color: 'bg-green-500', description: 'Connect with external services' }
  ]

  useEffect(() => {
    if (workflowId && isLoaded && user) {
      loadWorkflow()
    }
  }, [workflowId, isLoaded, user])

  const loadWorkflow = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/workflows/${workflowId}`)
      const result = await response.json()
      
      if (result.success) {
        setWorkflow({
          title: result.data.title,
          description: result.data.description,
          category: result.data.category,
          tags: result.data.tags,
          isPublic: result.data.isPublic,
          steps: result.data.steps || []
        })
      } else {
        toast.error('Failed to load workflow')
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
      toast.error('An error occurred while loading the workflow')
    } finally {
      setLoading(false)
    }
  }

  const addStep = (type: WorkflowStep['type']) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      description: '',
      type,
      config: {},
      position: { x: 100, y: workflow.steps.length * 120 + 100 },
      connections: []
    }

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
  }

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }

  const deleteStep = (stepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  const addTag = () => {
    setWorkflow(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }))
  }

  const updateTag = (index: number, value: string) => {
    setWorkflow(prev => ({
      ...prev,
      tags: prev.tags.map((tag, i) => i === index ? value : tag)
    }))
  }

  const removeTag = (index: number) => {
    setWorkflow(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const saveWorkflow = async (publish: boolean = false) => {
    if (!user) return

    setSaving(true)
    try {
      const method = workflowId ? 'PUT' : 'POST'
      const url = workflowId ? `/api/workflows/${workflowId}` : '/api/workflows'
      
      const payload = {
        ...workflow,
        isPublic: publish || workflow.isPublic,
        tags: workflow.tags.filter(tag => tag.trim())
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(`Workflow ${workflowId ? 'updated' : 'created'} successfully!`)
        if (!workflowId) {
          router.push(`/workflow/builder?id=${result.data._id}`)
        }
      } else {
        toast.error(result.error || 'Failed to save workflow')
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
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
                  <Workflow className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-violet-700 bg-clip-text text-transparent">
                  Workflow Builder
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => saveWorkflow(false)}
                disabled={saving}
                variant="outline"
                className="text-navy-600 border-navy-200"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              
              <Button
                onClick={() => saveWorkflow(true)}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish
              </Button>
              
              {workflowId && (
                <Link href={`/workflow/${workflowId}`}>
                  <Button variant="outline" className="text-navy-600 border-navy-200">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow Properties Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 border-navy-100">
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Workflow Properties</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Title</label>
                  <Input
                    type="text"
                    value={workflow.title}
                    onChange={(e) => setWorkflow({...workflow, title: e.target.value})}
                    placeholder="Enter workflow title"
                    className="bg-white border-navy-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Description</label>
                  <Textarea
                    value={workflow.description}
                    onChange={(e) => setWorkflow({...workflow, description: e.target.value})}
                    placeholder="Describe what this workflow does..."
                    className="bg-white border-navy-200 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Category</label>
                  <select
                    value={workflow.category}
                    onChange={(e) => setWorkflow({...workflow, category: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-navy-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-2">Tags</label>
                  {workflow.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <Input
                        type="text"
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="Enter a tag"
                        className="bg-white border-navy-200"
                      />
                      {workflow.tags.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTag(index)}
                          className="text-red-600 border-red-200"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTag}
                    className="text-violet-600 border-violet-200"
                  >
                    Add Tag
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={workflow.isPublic}
                    onChange={(e) => setWorkflow({...workflow, isPublic: e.target.checked})}
                    className="w-4 h-4 text-violet-600 border-navy-300 rounded focus:ring-violet-500"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-navy-700">
                    Make workflow public
                  </label>
                </div>
              </div>
            </Card>

            {/* Step Types */}
            <Card className="p-6 border-navy-100">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Add Step</h3>
              <div className="space-y-2">
                {stepTypes.map(type => (
                  <Button
                    key={type.id}
                    onClick={() => addStep(type.id as WorkflowStep['type'])}
                    variant="outline"
                    className="w-full justify-start text-navy-700 border-navy-200 hover:bg-navy-50"
                  >
                    <div className={`w-3 h-3 rounded-full ${type.color} mr-3`}></div>
                    <div className="text-left">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-navy-500">{type.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Workflow Canvas */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-navy-100 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-navy-900">Workflow Steps</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-navy-100 text-navy-700">
                    {workflow.steps.length} steps
                  </Badge>
                </div>
              </div>

              {workflow.steps.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Workflow className="w-8 h-8 text-navy-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 mb-2">Start Building</h3>
                  <p className="text-navy-600 mb-6">Add your first step to get started with this workflow</p>
                  <div className="flex justify-center space-x-2">
                    {stepTypes.slice(0, 3).map(type => (
                      <Button
                        key={type.id}
                        onClick={() => addStep(type.id as WorkflowStep['type'])}
                        variant="outline"
                        className="text-violet-600 border-violet-200"
                      >
                        <div className={`w-3 h-3 rounded-full ${type.color} mr-2`}></div>
                        Add {type.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => {
                    const stepType = stepTypes.find(t => t.id === step.type)
                    return (
                      <Card key={step.id} className="p-4 border-navy-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${stepType?.color || 'bg-gray-500'}`}></div>
                            <div>
                              <h4 className="font-medium text-navy-900">{step.title}</h4>
                              <p className="text-sm text-navy-500 capitalize">{step.type} Step</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newTitle = prompt('Enter step title:', step.title)
                                if (newTitle) updateStep(step.id, { title: newTitle })
                              }}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStep(step.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <Input
                          value={step.description}
                          onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          placeholder="Step description..."
                          className="bg-white border-navy-200"
                        />
                      </Card>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
