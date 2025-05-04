"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Eye, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useApplicationStore } from "@/lib/application-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ApplicationsList() {
  const { toast } = useToast()
  const { applications, shortlistCandidate, rejectCandidate } = useApplicationStore()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [filter, setFilter] = useState("all")

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application)
    setIsViewOpen(true)
  }

  const handleShortlist = (applicationId: string) => {
    shortlistCandidate(applicationId)
    toast({
      title: "Candidate shortlisted",
      description: "The candidate has been added to your shortlist.",
    })
    setIsViewOpen(false)
  }

  const handleReject = (applicationId: string) => {
    rejectCandidate(applicationId)
    toast({
      title: "Application rejected",
      description: "The candidate has been notified of your decision.",
    })
    setIsViewOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "shortlisted":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Shortlisted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  // Filter applications based on selected filter
  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true
    return app.status === filter
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No applications found matching the selected filter.
        </div>
      ) : (
        <div className="divide-y">
          {filteredApplications.map((application) => (
            <div key={application.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={application.candidate.avatar || "/placeholder.svg"}
                    alt={application.candidate.name}
                  />
                  <AvatarFallback>{application.candidate.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{application.candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{application.job.title}</div>
                  <div className="text-xs text-muted-foreground">Applied on {application.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(application.status)}
                <Button variant="outline" size="sm" onClick={() => handleViewApplication(application)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the candidate's application for {selectedApplication?.job.title}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={selectedApplication.candidate.avatar || "/placeholder.svg"}
                        alt={selectedApplication.candidate.name}
                      />
                      <AvatarFallback>{selectedApplication.candidate.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{selectedApplication.candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedApplication.candidate.title}</p>
                      <div className="flex items-center gap-1 mt-1">{getStatusBadge(selectedApplication.status)}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.candidate.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Application</h4>
                    <div className="text-sm p-4 bg-muted/50 rounded-md">{selectedApplication.application}</div>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-2">Job Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Position:</span>
                        <p>{selectedApplication.job.title}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Company:</span>
                        <p>{selectedApplication.job.company}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p>{selectedApplication.job.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p>{selectedApplication.candidate.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p>{selectedApplication.candidate.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback (optional)</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Add notes or feedback about this candidate"
                  className="input-glass"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsViewOpen(false)} className="sm:order-1 order-3">
              Close
            </Button>
            {selectedApplication?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => selectedApplication && handleReject(selectedApplication.id)}
                  className="sm:order-2 order-2"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => selectedApplication && handleShortlist(selectedApplication.id)}
                  className="sm:order-3 order-1"
                >
                  Shortlist Candidate
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
