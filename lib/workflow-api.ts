import { supabase } from './supabase'
import { type LucideIcon } from 'lucide-react'

// Define the core data structures based on the minimal schema
// In a real app, the LucideIcon type would likely be just a string
// representing the icon's name, stored in the database.
export interface WorkflowStep {
  id: number
  title: string
  icon: string // Name of the Lucide icon
  description: string
  color: string
  duration: string
  automated: boolean
  workflow_id?: string // Foreign key to workflows table
  step_order?: number // To maintain order
}

export interface Workflow {
  id: string
  name: string
  description: string
  user_id: string
  steps: WorkflowStep[]
}

export interface User {
  id: string
  name: string
  email: string
}

// --- API FUNCTIONS ---
// These functions now interact with the Supabase backend.

export const getWorkflow = async (workflowId: string): Promise<Workflow | undefined> => {
  console.log(`API: Fetching workflow ${workflowId}`)
  const { data: workflowData, error: workflowError } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', workflowId)
    .single()

  if (workflowError) {
    console.error('Error fetching workflow:', workflowError)
    return undefined
  }

  if (!workflowData) {
    return undefined
  }

  const { data: stepsData, error: stepsError } = await supabase
    .from('workflow_steps')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('step_order', { ascending: true })

  if (stepsError) {
    console.error('Error fetching workflow steps:', stepsError)
    // Return workflow without steps if steps fail to load
    return { ...workflowData, steps: [] }
  }

  return { ...workflowData, steps: stepsData || [] }
}

export const addWorkflowStep = async (
  workflowId: string,
  newStepData: Omit<WorkflowStep, 'id'>,
): Promise<WorkflowStep> => {
  console.log(`API: Added step "${newStepData.title}" to workflow ${workflowId}`)
  const { data, error } = await supabase
    .from('workflow_steps')
    .insert([{ ...newStepData, workflow_id: workflowId }])
    .select()
    .single()

  if (error) {
    console.error('Error adding workflow step:', error)
    throw new Error('Failed to add workflow step')
  }
  return data
}

export const updateWorkflowStep = async (workflowId: string, updatedStep: WorkflowStep): Promise<WorkflowStep> => {
  console.log(`API: Updated step "${updatedStep.title}" in workflow ${workflowId}`)
  const { data, error } = await supabase
    .from('workflow_steps')
    .update(updatedStep)
    .eq('id', updatedStep.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating workflow step:', error)
    throw new Error('Failed to update workflow step')
  }
  return data
}

export const deleteWorkflowStep = async (workflowId: string, stepId: number): Promise<{ success: true }> => {
  console.log(`API: Deleted step with id ${stepId} from workflow ${workflowId}`)
  const { error } = await supabase
    .from('workflow_steps')
    .delete()
    .eq('id', stepId)

  if (error) {
    console.error('Error deleting workflow step:', error)
    throw new Error('Failed to delete workflow step')
  }
  return { success: true }
}

export const reorderWorkflowSteps = async (workflowId: string, orderedStepIds: number[]): Promise<WorkflowStep[]> => {
  console.log(`API: Reordered steps for workflow ${workflowId}`)
  const updates = orderedStepIds.map((id, index) =>
    supabase
      .from('workflow_steps')
      .update({ step_order: index })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter((res) => res.error)

  if (errors.length > 0) {
    console.error('Error reordering steps:', errors)
    throw new Error('Failed to reorder workflow steps')
  }

  // Fetch the reordered steps to return them
  const { data: stepsData, error: stepsError } = await supabase
    .from('workflow_steps')
    .select('*')
    .eq('workflow_id', workflowId)
    .order('step_order', { ascending: true })

  if (stepsError) {
      console.error('Error fetching reordered steps:', stepsError)
      throw new Error('Failed to fetch reordered steps')
  }

  return stepsData || []
}

export interface WorkflowWithConsultant extends Workflow {
  consultant: User
}

export const getActiveWorkflowsForUser = async (userId: string): Promise<WorkflowWithConsultant[]> => {
  console.log(`API: Fetching active workflows for user ${userId}`)
  // This is a simplified query. In a real application, you'd likely have a
  // 'client_workflows' table to represent the relationship between users (clients)
  // and workflows. For now, we'll assume the user dashboard should show all workflows
  // from all consultants, and the user_id on the workflow is the consultant.
  // We'll also need to fetch the consultant's details.

  const { data, error } = await supabase
    .from('workflows')
    .select(`
      *,
      consultant:users(id, name, email)
    `)
    // .eq('client_id', userId) // This would be the ideal query

  if (error) {
    console.error('Error fetching active workflows:', error)
    return []
  }

  // The result from Supabase needs to be mapped to our interface
  const workflowsWithConsultants = data.map((d: any) => ({
    ...d,
    user_id: d.user_id,
    consultant: d.consultant,
    steps: [], // We're not fetching steps for the dashboard view for simplicity
  }))

  return workflowsWithConsultants
}
