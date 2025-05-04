"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, ExternalLink, XCircle } from "lucide-react"

export function VerificationQueue() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()

  // Mock data for verification queue
  const [queue, setQueue] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      skill: "Solidity",
      experience: "4 years",
      proofLink: "https://github.com/sarahw/solidity-projects",
      date: "Apr 15, 2023",
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        username: "mikec",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      skill: "React",
      experience: "3 years",
      proofLink: "https://mikec-portfolio.com",
      date: "Apr 18, 2023",
    },
    {
      id: 3,
      user: {
        name: "Emma Davis",
        username: "emmad",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      skill: "Smart Contract Auditing",
      experience: "2 years",
      proofLink: "https://etherscan.io/address/0x123...",
      date: "Apr 20, 2023",
    },
  ])

  const handleVerify = async (skillId: number) => {
    try {
      // Sign the verification message
      const message = `Verify skill ID: ${skillId}`
      await signMessage(message)

      // Remove from queue
      setQueue((prev) => prev.filter((item) => item.id !== skillId))

      toast({
        title: "Skill verified",
        description: "You have successfully verified this skill",
      })
    } catch (error) {
      console.error("Error verifying skill:", error)
      toast({
        title: "Verification failed",
        description: "Failed to verify skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (skillId: number) => {
    try {
      // Sign the rejection message
      const message = `Reject skill ID: ${skillId}`
      await signMessage(message)

      // Remove from queue
      setQueue((prev) => prev.filter((item) => item.id !== skillId))

      toast({
        title: "Skill rejected",
        description: "You have rejected this skill verification",
      })
    } catch (error) {
      console.error("Error rejecting skill:", error)
      toast({
        title: "Rejection failed",
        description: "Failed to reject skill. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      {queue.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No skills in the verification queue.</div>
      ) : (
        <div className="divide-y">
          {queue.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={item.user.avatar || "/placeholder.svg"} alt={item.user.name} />
                  <AvatarFallback>{item.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.user.name}</div>
                      <div className="text-xs text-muted-foreground">@{item.user.username}</div>
                    </div>
                    <Badge>{item.skill}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <div>
                      <span className="font-medium">Experience:</span> {item.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Proof:</span>
                      <a
                        href={item.proofLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        View proof <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {item.date}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleVerify(item.id)}>
                      <CheckCircle className="h-3 w-3" />
                      Verify
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleReject(item.id)}>
                      <XCircle className="h-3 w-3" />
                      Reject
                    </Button>
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
