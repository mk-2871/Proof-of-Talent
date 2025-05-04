"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Briefcase, FileUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useJobStore } from "@/lib/job-store"
import { useApplicationStore } from "@/lib/application-store"
import { useAuth } from "@/components/auth/auth-provider"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function JobsList() {
  const { toast } = useToast()
  const { signMessage } = useWeb3()
  const { user } = useAuth()
  const { getActiveJobs } = useJobStore()
  const { addApplication, getCandidateResume } = useApplicationStore()

  // Get only active jobs for candidates
  const jobs = getActiveJobs()

  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [application, setApplication] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has a resume in their profile
  const existingResume = user?.id ? getCandidateResume(user.id) : null
  const [hasResume, setHasResume] = useState(!!existingResume)

  // Update hasResume when existingResume changes
  useEffect(() => {
    setHasResume(!!existingResume || !!resumeFile)
  }, [existingResume, resumeFile])

  const handleApply = async () => {
    if (!hasResume && !resumeFile) {
      toast({
        title: "Resume required",
        description: "Please upload your resume before applying.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Sign the application message
      if (signMessage) {
        try {
          const message = `Apply for job ID: ${selectedJob.id}\nApplication: ${application}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing with application anyway")
        }
      }

      // Process resume file if uploaded
      let resumeData = existingResume
      if (resumeFile) {
        resumeData = {
          name: resumeFile.name,
          size: resumeFile.size,
          type: resumeFile.type,
          lastModified: resumeFile.lastModified,
          // In a real app, we would upload this to storage and store the URL
          // For demo purposes, we'll just store the file metadata
        }
      }

      // Add application to store
      addApplication({
        jobId: selectedJob.id,
        job: {
          title: selectedJob.title,
          company: selectedJob.company,
          location: selectedJob.location,
        },
        candidate: {
          id: user?.id || "user123",
          name: user?.name || "Alex Johnson",
          title: "Blockchain Developer",
          email: user?.email || "alex@example.com",
          location: "New York, USA",
          avatar: "/placeholder.svg?height=40&width=40&text=AJ",
          skills: ["Solidity", "Ethereum", "Smart Contracts", "DeFi"],
        },
        application: application,
        resume: resumeData,
      })

      toast({
        title: "Application submitted",
        description: "Your job application has been submitted successfully",
      })

      setApplication("")
      setResumeFile(null)
      setSelectedJob(null)
    } catch (error) {
      console.error("Error applying for job:", error)
      toast({
        title: "Application failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No jobs available at the moment.</div>
      ) : (
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="py-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm">
                        {job.company} - {job.location}
                      </div>
                      <div className="text-xs text-muted-foreground">Posted on {job.date}</div>
                    </div>
                    <Badge>{job.budget}</Badge>
                  </div>
                  <div className="mt-2 text-sm">{job.description}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
                          <DialogDescription>Submit your application for this job opportunity</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="application">Application</Label>
                            <Textarea
                              id="application"
                              value={application}
                              onChange={(e) => setApplication(e.target.value)}
                              placeholder="Describe your experience and why you're a good fit for this role"
                              rows={6}
                              required
                            />
                          </div>

                          {!existingResume && (
                            <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/20">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Resume Required</AlertTitle>
                              <AlertDescription>You must upload a resume to apply for this job.</AlertDescription>
                            </Alert>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="resume" className="flex items-center gap-2">
                              Resume{" "}
                              {existingResume && (
                                <Badge variant="outline" className="text-green-600 bg-green-50">
                                  Profile Resume Available
                                </Badge>
                              )}
                            </Label>

                            {existingResume && (
                              <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                                <div className="flex items-center gap-2">
                                  <FileUp className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">{existingResume.name}</span>
                                  <Badge variant="outline">{(existingResume.size / 1024).toFixed(1)} KB</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Your profile resume will be used. You can upload a different resume below if you
                                  prefer.
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Input
                                id="resume"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="flex-1"
                              />
                              {resumeFile && (
                                <Badge variant="outline" className="gap-1">
                                  <FileUp className="h-3 w-3" />
                                  {resumeFile.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Upload your resume in PDF or DOCX format (max 5MB)
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedJob(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleApply} disabled={!hasResume || !application.trim() || isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
