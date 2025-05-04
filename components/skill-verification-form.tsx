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

interface SkillVerificationFormProps {
  onCancel: () => void
}

export function SkillVerificationForm({ onCancel }: SkillVerificationFormProps) {
  const { signMessage } = useWeb3()
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  const [formData, setFormData] = useState({
    skillName: "",
    experience: "",
    proofLink: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Sign the skill verification submission
      const message = `Submit skill for verification: ${JSON.stringify(formData)}`
      await signMessage(message)

      toast({
        title: "Skill submitted",
        description: "Your skill has been submitted for verification",
      })

      addNotification({
        title: "Skill Submitted",
        description: `Your skill "${formData.skillName}" has been submitted for verification.`,
        type: "success",
      })

      onCancel()
    } catch (error) {
      console.error("Error submitting skill:", error)
      toast({
        title: "Submission failed",
        description: "Failed to submit skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="skillName">Skill Name</Label>
        <Input
          id="skillName"
          name="skillName"
          value={formData.skillName}
          onChange={handleChange}
          placeholder="e.g., Solidity, React, Smart Contract Auditing"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experience">Experience Level</Label>
        <Input
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="e.g., 3 years, Beginner, Expert"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="proofLink">Proof Link</Label>
        <Input
          id="proofLink"
          name="proofLink"
          value={formData.proofLink}
          onChange={handleChange}
          placeholder="Link to GitHub, portfolio, certification, etc."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your experience and expertise with this skill"
          rows={4}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit for Verification</Button>
      </div>
    </form>
  )
}
