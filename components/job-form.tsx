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

interface JobFormProps {
  onCancel: () => void
}

export function JobForm({ onCancel }: JobFormProps) {
  const { signMessage } = useWeb3()
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    budget: "",
    location: "Remote",
    skills: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Sign the job posting message
      const message = `Post job: ${JSON.stringify(formData)}`
      await signMessage(message)

      toast({
        title: "Job posted",
        description: "Your job has been posted successfully",
      })

      addNotification({
        title: "Job Posted",
        description: `Your job "${formData.title}" has been posted successfully.`,
        type: "success",
      })

      onCancel()
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Posting failed",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Smart Contract Developer"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company/Project Name</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="e.g., DeFi Protocol"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job requirements and responsibilities"
          rows={4}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (ETH)</Label>
          <Input
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 0.5"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, New York"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Required Skills (comma separated)</Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., Solidity, React, Web3.js"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Post Job</Button>
      </div>
    </form>
  )
}
