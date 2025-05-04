"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useJobStore } from "@/lib/job-store"

export default function PostJobPage() {
  const { isRecruiter, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { addJob } = useJobStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    budget: "",
    skills: "",
    description: "",
  })

  // Redirect if not a recruiter
  useEffect(() => {
    if (!isRecruiter) {
      router.push("/auth")
    }
  }, [isRecruiter, router])

  if (!isRecruiter) {
    return null // Don't render anything while redirecting
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Add job to store
      const skillsArray = formData.skills.split(",").map((skill) => skill.trim())

      addJob({
        title: formData.title,
        company: formData.company,
        description: formData.description,
        budget: formData.budget,
        location: formData.location,
        skills: skillsArray,
        recruiterId: user?.id || "recruiter1", // Use the actual recruiter ID
      })

      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible in your dashboard.",
      })

      // Redirect to dashboard
      router.push("/recruiter/dashboard")
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        title: "Failed to post job",
        description: "There was an error posting your job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Post a New Job</h1>
          <p className="text-muted-foreground mt-1">Create a new job posting to find talented candidates</p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Fill in the details of the job you want to post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Solidity Developer"
                  required
                  className="input-glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., DeFi Protocol"
                  required
                  className="input-glass"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote, New York"
                  required
                  className="input-glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g., Full-time, Contract"
                  required
                  className="input-glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 0.5 ETH"
                  required
                  className="input-glass"
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
                className="input-glass"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job responsibilities, requirements, and any other relevant information..."
                rows={8}
                required
                className="input-glass"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Posting..." : "Post Job"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
