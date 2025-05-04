"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { CheckCircle, Clock, XCircle } from "lucide-react"

export function JobHistory() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()

  // Mock data for job history
  const jobs = [
    {
      id: 1,
      title: "Smart Contract Developer",
      company: "DeFi Protocol",
      status: "completed",
      payment: "0.5 ETH",
      date: "Feb 15, 2023",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "NFT Marketplace",
      status: "in-progress",
      payment: "0.3 ETH",
      date: "Apr 2, 2023",
    },
    {
      id: 3,
      title: "Blockchain Security Auditor",
      company: "Security DAO",
      status: "applied",
      payment: "0.8 ETH",
      date: "Apr 18, 2023",
    },
    {
      id: 4,
      title: "Solidity Consultant",
      company: "GameFi Project",
      status: "rejected",
      payment: "0.4 ETH",
      date: "Mar 10, 2023",
    },
  ]

  const handleWithdrawPayment = async (jobId: number) => {
    try {
      // Sign the withdraw payment message
      const message = `Withdraw payment for job ID: ${jobId}`
      await signMessage(message)

      toast({
        title: "Payment withdrawn",
        description: "Your payment has been successfully withdrawn",
      })
    } catch (error) {
      console.error("Error withdrawing payment:", error)
      toast({
        title: "Withdrawal failed",
        description: "Failed to withdraw payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
      case "applied":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            In Progress
          </Badge>
        )
      case "applied":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Applied
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
      {jobs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No job history found. Apply for jobs to build your history.
        </div>
      ) : (
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(job.status)}
                <div>
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground">{job.company}</div>
                  <div className="text-xs text-muted-foreground">{job.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge>{job.payment}</Badge>
                {getStatusBadge(job.status)}
                {job.status === "completed" && (
                  <Button variant="outline" size="sm" onClick={() => handleWithdrawPayment(job.id)}>
                    Withdraw Payment
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
