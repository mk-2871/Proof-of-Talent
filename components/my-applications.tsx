"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import { useApplicationStore } from "@/lib/application-store"
import { useAuth } from "@/components/auth/auth-provider"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PDFViewer } from "@/components/pdf-viewer"

export function MyApplications() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()
  const { user } = useAuth()
  const { applications, getApplicationsByCandidate } = useApplicationStore()
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [isViewingResume, setIsViewingResume] = useState(false)

  // Get applications for the current user
  const myApplications = user?.id ? getApplicationsByCandidate(user.id) : []

  const handleWithdrawApplication = async (applicationId: number) => {
    try {
      // Sign the withdraw application message
      if (signMessage) {
        try {
          const message = `Withdraw application ID: ${applicationId}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing anyway")
        }
      }

      toast({
        title: "Application withdrawn",
        description: "Your application has been withdrawn successfully",
      })
    } catch (error) {
      console.error("Error withdrawing application:", error)
      toast({
        title: "Withdrawal failed",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewResume = (application: any) => {
    setSelectedApplication(application)
    setIsViewingResume(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
      case "shortlisted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
      case "shortlisted":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Shortlisted
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {myApplications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No applications found. Apply for jobs to see your applications here.
        </div>
      ) : (
        <div className="divide-y">
          {myApplications.map((application) => (
            <div key={application.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(application.status)}
                <div>
                  <div className="font-medium">{application.job.title}</div>
                  <div className="text-sm text-muted-foreground">{application.job.company}</div>
                  <div className="text-xs text-muted-foreground">Applied on {application.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(application.status)}
                {application.resume && (
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewResume(application)}>
                    <FileText className="h-4 w-4" />
                    View Resume
                  </Button>
                )}
                {application.status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWithdrawApplication(Number.parseInt(application.id.replace("app", "")))}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resume Viewer Dialog */}
      <Dialog open={isViewingResume} onOpenChange={setIsViewingResume}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>My Resume</DialogTitle>
            <DialogDescription>Resume submitted for {selectedApplication?.job.title} application</DialogDescription>
          </DialogHeader>
          <div className="h-[70vh]">
            {selectedApplication?.resume ? (
              <PDFViewer
                file={selectedApplication.resume}
                onDownload={() => {
                  toast({
                    title: "Resume downloaded",
                    description: "Your resume has been downloaded.",
                  })
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-center py-8 text-muted-foreground">No resume was uploaded for this application.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
