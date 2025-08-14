'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Sparkles, 
  Loader2, 
  Download, 
  Save, 
  Play, 
  Brain,
  Zap,
  Clock,
  Target,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AIWorkflowBuilderProps {
  onWorkflowGenerated?: (workflow: any) => void
  className?: string
}

interface GeneratedWorkflow {
  workflow: any
  modelUsed: string
  userProAccess: boolean
  tokensUsed: number
}

export function AIWorkflowBuilder({ onWorkflowGenerated, className = '' }: AIWorkflowBuilderProps) {
  const [prompt, setPrompt] = useState('')
  const [context, setContext] = useState('')
  const [useUserAccount, setUseUserAccount] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null)
  const [error, setError] = useState('')

  const generateWorkflow = async () => {
    if (!prompt.trim()) {
      setError('Please describe the workflow you want to create')
      return
    }

    setGenerating(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai/gemini/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: context.trim(),
          useUserAccount
        })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate workflow')
      }

      setGeneratedWorkflow(data.data)
      onWorkflowGenerated?.(data.data.workflow)
    } catch (error: any) {
      setError(error.message || 'Failed to generate workflow')
    } finally {
      setGenerating(false)
    }
  }

  const saveWorkflow = async () => {
    if (!generatedWorkflow) return

    try {
      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(generatedWorkflow.workflow)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save workflow')
      }

      // Show success message or redirect
      alert('Workflow saved successfully!')
    } catch (error: any) {
      setError(error.message || 'Failed to save workflow')
    }
  }

  const downloadWorkflow = () => {
    if (!generatedWorkflow) return

    const blob = new Blob([JSON.stringify(generatedWorkflow.workflow, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedWorkflow.workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-900">AI Workflow Builder</h2>
            <p className="text-navy-600">Powered by Google Gemini - Describe your workflow and let AI build it for you</p>
          </div>
        </div>
      </Card>

      {/* Input Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-navy-700 mb-2 block">
              Describe Your Workflow *
            </label>
            <Textarea
              placeholder="Example: Create a workflow that automatically organizes my Gmail inbox by moving emails from different senders to specific labels, and sends me a weekly summary report via Google Sheets..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-navy-500 mt-1">
              Be specific about what you want the workflow to do, which services to use, and any conditions or triggers
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-navy-700 mb-2 block">
              Additional Context (Optional)
            </label>
            <Input
              placeholder="e.g., I work in marketing, I get 200+ emails daily, I use Google Workspace..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Switch
                checked={useUserAccount}
                onCheckedChange={setUseUserAccount}
                id="use-user-account"
              />
              <label htmlFor="use-user-account" className="text-sm font-medium text-navy-700">
                Use My Google Pro Account
              </label>
              <Badge variant="outline" className="text-xs">
                {useUserAccount ? 'Gemini Pro' : 'Gemini Flash'}
              </Badge>
            </div>
            <Button
              onClick={generateWorkflow}
              disabled={generating || !prompt.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Generated Workflow Display */}
      {generatedWorkflow && (
        <Card className="p-6">
          <div className="space-y-6">
            {/* Workflow Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-900">{generatedWorkflow.workflow.name}</h3>
                <p className="text-navy-600 mt-1">{generatedWorkflow.workflow.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Generated
                </Badge>
                <Badge variant="outline">
                  {generatedWorkflow.modelUsed}
                </Badge>
              </div>
            </div>

            {/* Workflow Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-navy-600" />
                <span className="text-sm text-navy-600">
                  {generatedWorkflow.workflow.category || 'automation'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-navy-600" />
                <span className="text-sm text-navy-600">
                  {generatedWorkflow.workflow.estimatedTime || '5 minutes'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-navy-600" />
                <span className="text-sm text-navy-600">
                  {generatedWorkflow.workflow.difficulty || 'beginner'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-navy-600" />
                <span className="text-sm text-navy-600">
                  {generatedWorkflow.workflow.steps?.length || 0} steps
                </span>
              </div>
            </div>

            {/* Tags */}
            {generatedWorkflow.workflow.tags && generatedWorkflow.workflow.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {generatedWorkflow.workflow.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Workflow Steps */}
            {generatedWorkflow.workflow.steps && generatedWorkflow.workflow.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-navy-900">Workflow Steps</h4>
                <div className="space-y-2">
                  {generatedWorkflow.workflow.steps.map((step: any, index: number) => (
                    <div key={step.id || index} className="flex items-start space-x-3 p-3 bg-navy-50 rounded-lg">
                      <div className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-navy-900">{step.name}</h5>
                        <p className="text-sm text-navy-600 mt-1">{step.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {step.type}
                          </Badge>
                          {step.service && (
                            <Badge variant="outline" className="text-xs">
                              {step.service}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-navy-100">
              <div className="text-sm text-navy-500">
                Tokens used: {generatedWorkflow.tokensUsed} | 
                Model: {generatedWorkflow.modelUsed} |
                {generatedWorkflow.userProAccess ? ' Pro Account' : ' Standard Account'}
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={downloadWorkflow}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={saveWorkflow} className="bg-violet-600 hover:bg-violet-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Workflow
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Better Workflows</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about your goals and requirements</li>
          <li>• Mention which Google services you want to integrate</li>
          <li>• Include any conditions, schedules, or triggers you need</li>
          <li>• Describe your current process to help AI understand context</li>
        </ul>
      </Card>
    </div>
  )
}
