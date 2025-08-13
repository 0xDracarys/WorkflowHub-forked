"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type WorkflowStep, type SupabaseWorkflowStep } from "@/lib/workflow-api"

interface EditStepModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updates: Partial<Omit<SupabaseWorkflowStep, "id" | "workflow_id" | "created_at">>) => void
  step: WorkflowStep | null
}

export function EditStepModal({ isOpen, onClose, onSave, step }: EditStepModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<SupabaseWorkflowStep["type"]>("custom")

  useEffect(() => {
    if (step) {
      setTitle(step.title)
      setDescription(step.description || "")
      setType(step.type)
    }
  }, [step])

  const handleSave = () => {
    if (!step) return

    const updates: Partial<Omit<SupabaseWorkflowStep, "id" | "workflow_id" | "created_at">> = {
      title,
      description,
      type,
    }
    onSave(updates)
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-navy-800 border-navy-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Step</DialogTitle>
          <DialogDescription className="text-navy-300">
            Make changes to your workflow step here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right text-navy-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-navy-900 border-navy-600 placeholder:text-navy-400"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right text-navy-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-navy-900 border-navy-600 placeholder:text-navy-400"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-navy-300">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as SupabaseWorkflowStep["type"])}>
              <SelectTrigger className="col-span-3 bg-navy-900 border-navy-600">
                <SelectValue placeholder="Select a step type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="form">Form</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-white border-navy-600 hover:bg-navy-700">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700 text-white">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
