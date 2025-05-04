"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { useApplicationStore } from "@/lib/application-store"
import { useAuth } from "@/components/auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, FileText, Upload, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProfileFormProps {
  user?: {
    name: string
    username: string
    bio: string
    avatar: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { signMessage } = useWeb3()
  const { toast } = useToast()
  const { user: authUser } = useAuth()
  const { updateResumeForCandidate, getCandidateResume } = useApplicationStore()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  })

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const existingResume = authUser?.id ? getCandidateResume(authUser.id) : null
  const [hasResume, setHasResume] = useState(!!existingResume)

  useEffect(() => {
    setHasResume(!!existingResume || !!resumeFile)
  }, [existingResume, resumeFile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or DOCX file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        })
        return
      }

      setResumeFile(file)
      setHasResume(true)
    }
  }

  const handleRemoveResume = () => {
    setResumeFile(null)
    if (!existingResume) {
      setHasResume(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Sign the profile update message
      if (signMessage) {
        try {
          const message = `Update profile: ${JSON.stringify(formData)}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing anyway")
        }
      }

      // Process resume file if uploaded
      if (resumeFile && authUser?.id) {
        const resumeData = {
          name: resumeFile.name,
          size: resumeFile.size,
          type: resumeFile.type,
          lastModified: resumeFile.lastModified,
          // In a real app, we would upload this to storage and store the URL
        }
        updateResumeForCandidate(authUser.id, resumeData)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Your username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="URL to your avatar image"
        />
      </div>

      {/* Resume Upload Section */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="resume" className="text-lg font-medium">
            Resume
          </Label>
          {!hasResume && <Badge variant="destructive">Required</Badge>}
        </div>

        <Alert variant="info" className="bg-blue-50 dark:bg-blue-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            A resume is required to apply for jobs on the platform. Please upload your resume in PDF or DOCX format.
          </AlertDescription>
        </Alert>

        {existingResume || resumeFile ? (
          <div className="flex items-center justify-between p-4 border rounded-md bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{resumeFile ? resumeFile.name : existingResume?.name}</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                {resumeFile
                  ? `${(resumeFile.size / 1024).toFixed(1)} KB`
                  : `${(existingResume?.size / 1024).toFixed(1)} KB`}
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveResume}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Input id="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("resume")?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Upload your resume in PDF or DOCX format (max 5MB). This will be used for all your job applications.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving Changes..." : "Save Changes"}
      </Button>
    </form>
  )
}
