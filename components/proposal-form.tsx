"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/components/notification-provider"

interface ProposalFormProps {
  onCancel: () => void
}

export function ProposalForm({ onCancel }: ProposalFormProps) {
  const { signMessage } = useWeb3()
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Sign the proposal creation message
      const message = `Create proposal: ${JSON.stringify(formData)}`
      await signMessage(message)

      toast({
        title: "Proposal created",
        description: "Your proposal has been created successfully",
      })

      addNotification({
        title: "Proposal Created",
        description: `Your proposal "${formData.title}" has been created successfully.`,
        type: "success",
      })

      onCancel()
    } catch (error) {
      console.error("Error creating proposal:", error)
      toast({
        title: "Creation failed",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Proposal Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Add Rust as a verified skill category"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Proposal Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your proposal in detail, including the rationale and expected impact"
          rows={6}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="deadline">Voting Deadline</Label>
        <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Proposal</Button>
      </div>
    </form>
  )
}
