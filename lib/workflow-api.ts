// lib/workflow-api.ts
import { getSupabaseClient } from "./supabase-client"

// --- TYPE DEFINITIONS ---

// This interface matches the 'workflow_steps' table in Supabase.
export interface SupabaseWorkflowStep {
  id: string // UUID
  workflow_id: string
  title: string
  description: string | null
  order_index: number
  type: "form" | "meeting" | "payment" | "custom"
  created_at: string
}

// This interface matches the 'workflows' table in Supabase.
export interface SupabaseWorkflow {
  id: string // UUID
  user_id: string
  title: string
  description: string | null
  price: number | null
  created_at: string
}

// This is a "rich" or "hydrated" type that we'll use on the frontend.
export interface WorkflowStep extends SupabaseWorkflowStep {
  iconName: string // The name of the Lucide icon to render
  color: string // The background color class for the UI
}

// The primary workflow object for the frontend, including the hydrated steps.
export interface Workflow extends SupabaseWorkflow {
  steps: WorkflowStep[]
}

// --- UI MAPPING & HYDRATION ---

const stepTypeUIMap = {
  form: { iconName: "FileText", color: "bg-navy-500" },
  meeting: { iconName: "Calendar", color: "bg-violet-600" },
  payment: { iconName: "CheckCircle", color: "bg-emerald-600" },
  custom: { iconName: "Settings", color: "bg-gray-400" },
}

const hydrateStep = (step: SupabaseWorkflowStep): WorkflowStep => {
  const uiProps = stepTypeUIMap[step.type] || stepTypeUIMap.custom
  return {
    ...step,
    iconName: uiProps.iconName,
    color: uiProps.color,
  }
}

// --- API FUNCTIONS ---

export const getWorkflow = async (workflowId: string): Promise<Workflow | null> => {
  const supabase = getSupabaseClient()
  const { data: workflowData, error: workflowError } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .single()

  if (workflowError) {
    console.error("Error fetching workflow:", workflowError.message)
    throw new Error(workflowError.message)
  }

  if (!workflowData) {
    return null
  }

  const { data: stepsData, error: stepsError } = await supabase
    .from("workflow_steps")
    .select("*")
    .eq("workflow_id", workflowId)
    .order("order_index", { ascending: true })

  if (stepsError) {
    console.error("Error fetching workflow steps:", stepsError.message)
    throw new Error(stepsError.message)
  }

  const hydratedSteps = stepsData.map(hydrateStep)

  return {
    ...workflowData,
    steps: hydratedSteps,
  }
}

export const createWorkflowStep = async (
  workflowId: string,
  stepData: Omit<SupabaseWorkflowStep, "id" | "workflow_id" | "created_at">,
): Promise<WorkflowStep> => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("workflow_steps")
    .insert([{ ...stepData, workflow_id: workflowId }])
    .select()
    .single()

  if (error || !data) {
    console.error("Error creating step:", error?.message)
    throw new Error(error?.message || "Failed to create step")
  }

  return hydrateStep(data)
}

export const updateWorkflowStep = async (
  stepId: string,
  updates: Partial<Omit<SupabaseWorkflowStep, "id" | "workflow_id" | "created_at">>,
): Promise<WorkflowStep> => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("workflow_steps")
    .update(updates)
    .eq("id", stepId)
    .select()
    .single()

  if (error || !data) {
    console.error("Error updating step:", error?.message)
    throw new Error(error?.message || "Failed to update step")
  }

  return hydrateStep(data)
}

export const deleteWorkflowStep = async (stepId: string): Promise<{ success: true }> => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("workflow_steps").delete().eq("id", stepId)

  if (error) {
    console.error("Error deleting step:", error.message)
    throw new Error(error.message)
  }

  return { success: true }
}

export const reorderWorkflowSteps = async (
  updates: { id: string; order_index: number }[],
): Promise<{ success: true }> => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.from("workflow_steps").upsert(updates)

  if (error) {
    console.error("Error reordering steps:", error.message)
    throw new Error(error.message)
  }

  return { success: true }
}
