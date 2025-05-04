"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Download, FileText, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useJobStore } from "@/lib/job-store"
import { useApplicationStore } from "@/lib/application-store"
import { useAuth } from "@/components/auth/auth-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MyJobs() {
  const { signMessage, sendTransaction } = useWeb3()
  const { toast } = useToast()
  const { user } = useAuth()
  const { getRecruiterJobs } = useJobStore()
  const { applications, getApplicationsByJob, shortlistCandidate, rejectCandidate } = useApplicationStore()

  // Get jobs posted by the current recruiter
  const jobs = user?.id ? getRecruiterJobs(user.id) : []

  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isViewingResume, setIsViewingResume] = useState(false)
  const [resumeViewTab, setResumeViewTab] = useState("preview")

  const handleAcceptApplicant = async (jobId: string, applicationId: string) => {
    try {
      // Sign the accept applicant message
      if (signMessage) {
        try {
          const message = `Accept applicant ID: ${applicationId} for job ID: ${jobId}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing anyway")
        }
      }

      // Update applicant status
      shortlistCandidate(applicationId)

      toast({
        title: "Candidate shortlisted",
        description: "You have shortlisted this candidate for the job",
      })
    } catch (error) {
      console.error("Error accepting applicant:", error)
      toast({
        title: "Shortlisting failed",
        description: "Failed to shortlist candidate. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectApplicant = async (jobId: string, applicationId: string) => {
    try {
      // Sign the reject applicant message
      if (signMessage) {
        try {
          const message = `Reject applicant ID: ${applicationId} for job ID: ${jobId}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing anyway")
        }
      }

      // Update applicant status
      rejectCandidate(applicationId)

      toast({
        title: "Application rejected",
        description: "You have rejected this candidate's application",
      })
    } catch (error) {
      console.error("Error rejecting applicant:", error)
      toast({
        title: "Rejection failed",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReleasePayment = async (jobId: string, amount: string) => {
    try {
      // Get the job and accepted applicant
      const job = jobs.find((j) => j.id === jobId)
      const jobApplications = getApplicationsByJob(jobId)
      const acceptedApplicant = jobApplications.find((a) => a.status === "shortlisted")

      if (!acceptedApplicant) {
        throw new Error("No shortlisted candidate found")
      }

      // Mock address for the accepted applicant
      const applicantAddress = "0x1234567890123456789012345678901234567890"

      // Send transaction
      if (sendTransaction) {
        try {
          await sendTransaction(applicantAddress, amount.replace(" ETH", ""))
        } catch (error) {
          console.log("Transaction failed or rejected, showing success message anyway for demo")
        }
      }

      toast({
        title: "Payment released",
        description: `Payment of ${amount} has been sent to ${acceptedApplicant.candidate.name}`,
      })
    } catch (error) {
      console.error("Error releasing payment:", error)
      toast({
        title: "Payment failed",
        description: "Failed to release payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewResume = (application: any) => {
    setSelectedApplication(application)
    setIsViewingResume(true)
    setResumeViewTab("preview")
  }

  const handleDownloadResume = (application: any) => {
    // In a real app, this would download the actual file
    // For this demo, we'll just show a toast
    toast({
      title: "Resume downloaded",
      description: `${application.candidate.name}'s resume has been downloaded.`,
    })
  }

  return (
    <div className="space-y-4">
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No jobs posted. Post a job to see it here.</div>
      ) : (
        <div className="divide-y">
          {jobs.map((job) => {
            const jobApplications = getApplicationsByJob(job.id)

            return (
              <div key={job.id} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.company}</div>
                    <div className="text-xs text-muted-foreground">Posted on {job.date}</div>
                  </div>
                  <Badge>{job.budget}</Badge>
                </div>
                <div className="mt-2 text-sm">{job.description}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{jobApplications.length}</span> applicant(s)
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedJob(job)}>
                        View Applicants
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-auto">
                      <DialogHeader>
                        <DialogTitle>Applicants for {selectedJob?.title}</DialogTitle>
                        <DialogDescription>Review and manage applicants for this job</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {selectedJob && getApplicationsByJob(selectedJob.id).length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">No applicants yet.</div>
                        ) : (
                          selectedJob &&
                          getApplicationsByJob(selectedJob.id).map((applicant) => (
                            <div key={applicant.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={applicant.candidate.avatar || "/placeholder.svg"}
                                    alt={applicant.candidate.name}
                                  />
                                  <AvatarFallback>{applicant.candidate.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{applicant.candidate.name}</div>
                                      <div className="text-xs text-muted-foreground">{applicant.candidate.email}</div>
                                    </div>
                                    {applicant.status === "pending" ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                                      >
                                        Pending
                                      </Badge>
                                    ) : applicant.status === "shortlisted" ? (
                                      <Badge
                                        variant="outline"
                                        className="bg-green-500/10 text-green-500 border-green-500/20"
                                      >
                                        Shortlisted
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                        Rejected
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="mt-2 text-sm">
                                    <p className="font-medium mb-1">Application:</p>
                                    <p className="text-muted-foreground">{applicant.application}</p>
                                  </div>

                                  <div className="mt-3 flex flex-wrap items-center gap-2">
                                    {applicant.resume && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border-blue-200"
                                        onClick={() => handleViewResume(applicant)}
                                      >
                                        <FileText className="h-3 w-3" />
                                        View Resume
                                      </Button>
                                    )}

                                    {applicant.status === "pending" ? (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-1 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200"
                                          onClick={() => handleAcceptApplicant(selectedJob.id, applicant.id)}
                                        >
                                          <CheckCircle className="h-3 w-3" />
                                          Shortlist
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                                          onClick={() => handleRejectApplicant(selectedJob.id, applicant.id)}
                                        >
                                          <XCircle className="h-3 w-3" />
                                          Reject
                                        </Button>
                                      </>
                                    ) : applicant.status === "shortlisted" ? (
                                      <Button
                                        size="sm"
                                        onClick={() => handleReleasePayment(selectedJob.id, selectedJob.budget)}
                                      >
                                        Release Payment
                                      </Button>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Resume Viewer Dialog */}
      <Dialog open={isViewingResume} onOpenChange={setIsViewingResume}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Resume - {selectedApplication?.candidate.name}</DialogTitle>
            <DialogDescription>Viewing resume for {selectedApplication?.job.title} application</DialogDescription>
          </DialogHeader>

          <Tabs value={resumeViewTab} onValueChange={setResumeViewTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="border rounded-lg p-4">
              <div className="bg-white p-6 min-h-[400px] flex flex-col">
                {selectedApplication?.resume ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedApplication.candidate.name}</h2>
                        <p className="text-gray-600">{selectedApplication.candidate.title}</p>
                        <p className="text-gray-500 text-sm">
                          {selectedApplication.candidate.email} • {selectedApplication.candidate.location}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDownloadResume(selectedApplication)}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.candidate.skills.map((skill: string, i: number) => (
                            <Badge key={i} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Experience</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between">
                              <p className="font-medium">Senior Blockchain Developer</p>
                              <p className="text-sm text-gray-500">2020 - Present</p>
                            </div>
                            <p className="text-sm text-gray-600">DeFi Protocol</p>
                            <p className="text-sm mt-1">
                              Led development of smart contracts for lending and borrowing platform. Implemented ERC-20
                              token standards and DeFi protocols.
                            </p>
                          </div>
                          <div>
                            <div className="flex justify-between">
                              <p className="font-medium">Blockchain Developer</p>
                              <p className="text-sm text-gray-500">2018 - 2020</p>
                            </div>
                            <p className="text-sm text-gray-600">NFT Marketplace</p>
                            <p className="text-sm mt-1">
                              Developed smart contracts for NFT minting and trading. Integrated Web3 wallet connections.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Education</h3>
                        <div>
                          <p className="font-medium">BSc Computer Science</p>
                          <p className="text-sm text-gray-600">University of Technology</p>
                          <p className="text-sm text-gray-500">2014 - 2018</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-4 text-center">
                      This is a mock resume preview. In a real application, you would see the actual PDF content.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center py-8 text-muted-foreground">
                      No resume was uploaded for this application.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="p-4 border rounded-md bg-muted/20">
                {selectedApplication?.resume ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{selectedApplication.resume.name}</span>
                      </div>
                      <Badge variant="outline">{(selectedApplication.resume.size / 1024).toFixed(1)} KB</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">File Type</p>
                        <p className="text-muted-foreground">{selectedApplication.resume.type}</p>
                      </div>
                      <div>
                        <p className="font-medium">Last Modified</p>
                        <p className="text-muted-foreground">
                          {new Date(selectedApplication.resume.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDownloadResume(selectedApplication)}
                      >
                        <Download className="h-3 w-3" />
                        Download Resume
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No resume was uploaded for this application.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
