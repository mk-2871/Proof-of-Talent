"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { Separator } from "@/components/ui/separator"

export function GeneralSettings() {
  const { toast } = useToast()
  const { signMessage } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Mock user data
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Blockchain developer and smart contract auditor with 5+ years of experience in DeFi and NFT projects.",
    skillSummary: "Solidity, React, Web3.js, Smart Contract Auditing, DeFi",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [originalData] = useState({ ...formData })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsSaved(false)
  }

  const handleAvatarChange = () => {
    // Mock file upload
    toast({
      title: "Upload started",
      description: "Your profile picture is being uploaded...",
    })

    // Simulate upload delay
    setTimeout(() => {
      toast({
        title: "Upload complete",
        description: "Your profile picture has been updated.",
      })
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sign the profile update message
      const message = `Update profile: ${JSON.stringify(formData)}`
      await signMessage(message)

      toast({
        title: "Settings saved",
        description: "Your profile information has been updated successfully.",
      })
      setIsSaved(true)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevert = () => {
    setFormData(originalData)
    toast({
      title: "Changes reverted",
      description: "Your changes have been discarded.",
    })
    setIsSaved(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
            <AvatarFallback>{formData.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" size="sm" onClick={handleAvatarChange} className="gap-2">
            <Upload className="h-4 w-4" />
            Change Picture
          </Button>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-glass"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="input-glass"
                placeholder="Your email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-glass min-h-[100px]"
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillSummary">Skill Summary</Label>
            <Textarea
              id="skillSummary"
              name="skillSummary"
              value={formData.skillSummary}
              onChange={handleChange}
              className="input-glass"
              placeholder="List your key skills (comma separated)"
            />
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleRevert} disabled={isLoading || isSaved}>
          Discard Changes
        </Button>
        <Button type="submit" disabled={isLoading || isSaved} className="gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaved ? "Saved" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
