"use client"

import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Workflow, 
  ArrowLeft, 
  Eye, 
  Share2,
  Edit,
  Star,
  User,
  Calendar,
  CheckCircle,
  Settings,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface WorkflowStep {
  id: string
  title: string
  description: string
  type: 'action' | 'condition' | 'loop' | 'delay' | 'integration'
}

interface WorkflowData {
  _id: string
  title: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  steps: WorkflowStep[]
  userId: string
  createdAt: string
  usageCount: number
  rating: number
}

export default function WorkflowViewPage() {
  const { user, isLoaded } = useUser()
  const params = useParams()
  const workflowId = params.id as string
  
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (workflowId && isLoaded) {
      loadWorkflow()
    }
  }, [workflowId, isLoaded])

  const loadWorkflow = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/workflows/${workflowId}`)
      const result = await response.json()
      
      if (result.success) {
        setWorkflow(result.data)
      } else {
        setError(result.error || 'Failed to load workflow')
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
      setError('An error occurred while loading the workflow')
    } finally {
      setLoading(false)
    }
  }

  const stepTypeColors = {
    action: 'bg-blue-500',
    condition: 'bg-yellow-500',
    loop: 'bg-purple-500',
    delay: 'bg-gray-500',
    integration: 'bg-green-500'
  }

  const stepTypeIcons = {
    action: CheckCircle,
    condition: Settings,
    loop: Workflow,
    delay: Calendar,
    integration: Share2
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-navy-600">Loading workflow...</p>
        </div>
      </div>
    )
  }

  if (error || !workflow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-navy-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Workflow className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Workflow Not Found</h1>
          <p className="text-navy-600 mb-6">{error || 'The workflow you\'re looking for doesn\'t exist.'}</p>
          <Link href="/dashboard">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === workflow.userId

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
                  {workflow.title}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isOwner && (
                <Link href={`/workflow/builder?id=${workflow._id}`}>
                  <Button variant="outline" className="text-navy-600 border-navy-200">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
              
              <Button variant="outline" className="text-navy-600 border-navy-200">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workflow Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <Card className="p-6 border-navy-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-navy-900 mb-2">{workflow.title}</h1>
                  <p className="text-navy-600 text-lg">{workflow.description}</p>
                </div>
                <Badge variant="secondary" className={`${workflow.isPublic ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {workflow.isPublic ? 'Public' : 'Private'}
                </Badge>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-navy-500" />
                  <span className="text-sm text-navy-600">{workflow.usageCount} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-navy-500" />
                  <span className="text-sm text-navy-600">{workflow.rating} rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-navy-500" />
                  <span className="text-sm text-navy-600">
                    Created {new Date(workflow.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {workflow.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-navy-600 border-navy-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Steps */}
            <Card className="p-6 border-navy-100">
              <h2 className="text-xl font-semibold text-navy-900 mb-4">Workflow Steps</h2>
              
              {workflow.steps.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-navy-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Workflow className="w-8 h-8 text-navy-400" />
                  </div>
                  <p className="text-navy-600">No steps defined yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => {
                    const StepIcon = stepTypeIcons[step.type] || Settings
                    const colorClass = stepTypeColors[step.type] || 'bg-gray-500'
                    
                    return (
                      <div key={step.id} className="flex items-start space-x-4 p-4 bg-navy-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-navy-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-navy-700">{index + 1}</span>
                          </div>
                          <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                            <StepIcon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-navy-900 mb-1">{step.title}</h4>
                          <p className="text-navy-600 text-sm mb-2">{step.description}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {step.type} Step
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <Card className="p-6 border-navy-100">
              <h3 className="font-semibold text-navy-900 mb-3">Category</h3>
              <Badge className="bg-violet-100 text-violet-700">
                {workflow.category || 'General'}
              </Badge>
            </Card>

            {/* Stats */}
            <Card className="p-6 border-navy-100">
              <h3 className="font-semibold text-navy-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-navy-600">Total Steps</span>
                  <span className="font-medium text-navy-900">{workflow.steps.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-600">Views</span>
                  <span className="font-medium text-navy-900">{workflow.usageCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-600">Rating</span>
                  <span className="font-medium text-navy-900">{workflow.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-600">Visibility</span>
                  <span className="font-medium text-navy-900">
                    {workflow.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            {isOwner && (
              <Card className="p-6 border-navy-100">
                <h3 className="font-semibold text-navy-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <Link href={`/workflow/builder?id=${workflow._id}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Workflow
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Workflow
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
