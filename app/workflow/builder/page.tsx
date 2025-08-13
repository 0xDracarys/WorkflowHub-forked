"use client"

export const dynamic = "force-dynamic"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Plus,
  ArrowLeft,
  Settings,
  FileText,
  Calendar,
  CheckCircle,
  MessageSquare,
  Upload,
  Zap,
  Users,
  Star,
  DotIcon as DragHandleDots2Icon,
  Trash2,
  Edit,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  getWorkflow,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
  reorderWorkflowSteps,
  type Workflow,
  type WorkflowStep,
  type SupabaseWorkflowStep,
} from "@/lib/workflow-api"
import { EditStepModal } from "@/components/workflow/edit-step-modal"

const iconMap: { [key: string]: LucideIcon } = {
  MessageSquare,
  Upload,
  FileText,
  Calendar,
  CheckCircle,
  Settings,
  Users,
  Star,
  Zap,
}

export default function WorkflowBuilderPage() {
  const router = useRouter()
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [workflowName, setWorkflowName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [draggedStep, setDraggedStep] = useState<string | null>(null)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null)

  useEffect(() => {
    const fetchWorkflowData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this ID would come from the URL path
        const wf = await getWorkflow("e9e06183-9216-4339-9634-a43ea8695067")
        setWorkflow(wf)
        if (wf) {
          setWorkflowName(wf.title)
        }
      } catch (error) {
        console.error("Failed to fetch workflow", error)
        toast.error("Failed to load workflow. Please try refreshing the page.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchWorkflowData()
  }, [])

  const handleDragStart = (stepId: string) => {
    setDraggedStep(stepId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedStep === null || !workflow) return

    const steps = workflow.steps
    const draggedIndex = steps.findIndex((step) => step.id === draggedStep)
    const targetIndex = steps.findIndex((step) => step.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newSteps = [...steps]
    const [draggedItem] = newSteps.splice(draggedIndex, 1)
    newSteps.splice(targetIndex, 0, draggedItem)

    setWorkflow({ ...workflow, steps: newSteps })
    setDraggedStep(null)

    const orderUpdates = newSteps.map((step, index) => ({
      id: step.id,
      order_index: index,
    }))

    try {
      await reorderWorkflowSteps(orderUpdates)
      toast.success("Workflow order saved!")
    } catch (error) {
      console.error("Failed to reorder steps:", error)
      setWorkflow({ ...workflow, steps: steps }) // Revert on failure
      toast.error("Failed to save new order. Please try again.")
    }
  }

  const addNewStep = async () => {
    if (!workflow) return

    const newStepData = {
      title: "New Step",
      description: "Click edit to customize this step.",
      type: "custom" as const,
      order_index: workflow.steps.length,
    }
    try {
      const addedStep = await createWorkflowStep(workflow.id, newStepData)
      setWorkflow((prev) => (prev ? { ...prev, steps: [...prev.steps, addedStep] } : null))
      toast.success("Step added successfully!")
    } catch (error) {
      console.error("Failed to add step:", error)
      toast.error("Failed to add new step. Please try again.")
    }
  }

  const removeStep = async (stepId: string) => {
    if (!workflow) return
    const originalSteps = workflow.steps
    const newSteps = originalSteps.filter((step) => step.id !== stepId)
    setWorkflow({ ...workflow, steps: newSteps })
    try {
      await deleteWorkflowStep(stepId)
      toast.success("Step removed successfully!")
    } catch (error) {
      console.error("Failed to delete step:", error)
      setWorkflow({ ...workflow, steps: originalSteps }) // Revert on failure
      toast.error("Failed to delete step. Please try again.")
    }
  }

  const handleOpenEditModal = (step: WorkflowStep) => {
    setEditingStep(step)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingStep(null)
  }

  const handleSaveStep = async (
    updates: Partial<Omit<SupabaseWorkflowStep, "id" | "workflow_id" | "created_at">>,
  ) => {
    if (!editingStep || !workflow) return

    const originalSteps = [...workflow.steps]
    // Optimistically update UI
    setWorkflow((prev) => {
      if (!prev) return null
      return {
        ...prev,
        steps: prev.steps.map((s) => (s.id === editingStep.id ? { ...s, ...updates, iconName: s.iconName, color: s.color } : s)),
      }
    })
    handleCloseEditModal()

    try {
      await updateWorkflowStep(editingStep.id, updates)
      toast.success("Step updated successfully!")
    } catch (error) {
      console.error("Failed to update step:", error)
      toast.error("Failed to save changes. Please try again.")
      // Revert on failure
      setWorkflow({ ...workflow, steps: originalSteps })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-navy-800 flex items-center justify-center">
        <p className="text-white text-xl">Loading Workflow Builder...</p>
      </div>
    )
  }

  if (!workflow) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-navy-800 flex items-center justify-center">
        <p className="text-white text-xl">Could not load workflow.</p>
      </div>
    )
  }

  const workflowSteps = workflow.steps

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-violet-900 to-navy-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 pt-8">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-white hover:text-violet-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Workflow Builder</span>
          </div>
        </div>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <label htmlFor="workflowName" className="text-sm font-medium text-white mb-2 block">
            Workflow Name
          </label>
          <Input
            id="workflowName"
            placeholder="Give your workflow a unique name..."
            className="bg-white/10 border-white/20 text-white placeholder:text-navy-300 text-2xl font-bold"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
          />
        </Card>

        <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="font-semibold text-white mb-4">Workflow Steps</h3>
          <div className="space-y-3 mb-6">
            {workflowSteps.map((step) => {
              const IconComponent = iconMap[step.iconName] || Settings
              return (
                <div
                  key={step.id}
                  draggable
                  onDragStart={() => handleDragStart(step.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, step.id)}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-move group"
                >
                  <DragHandleDots2Icon className="w-5 h-5 text-white/50 group-hover:text-white" />
                  <div
                    className={`w-10 h-10 ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <p className="text-navy-300 text-sm">{step.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/70 hover:text-white"
                      onClick={() => handleOpenEditModal(step)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          <Button
            onClick={addNewStep}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </Card>
      </div>
      <EditStepModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSave={handleSaveStep} step={editingStep} />
    </div>
  )
}
