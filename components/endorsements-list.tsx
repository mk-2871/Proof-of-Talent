"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { ThumbsUp } from "lucide-react"

export function EndorsementsList() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()

  // Mock data for endorsements
  const endorsements = [
    {
      id: 1,
      from: {
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      skill: "Solidity",
      reason: "Alex helped me debug a complex smart contract issue. Highly skilled in Solidity.",
      date: "Mar 15, 2023",
    },
    {
      id: 2,
      from: {
        name: "Michael Chen",
        username: "mikec",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      skill: "React",
      reason: "Great React skills. Built a complex dApp interface that was both functional and beautiful.",
      date: "Apr 2, 2023",
    },
    {
      id: 3,
      from: {
        name: "Emma Davis",
        username: "emmad",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      skill: "Web3.js",
      reason: "Excellent knowledge of Web3.js. Helped our team integrate wallet connections seamlessly.",
      date: "Apr 18, 2023",
    },
  ]

  const handleEndorseBack = async (userId: string) => {
    try {
      // Sign the endorse back message
      const message = `Endorse user: ${userId}`
      await signMessage(message)

      toast({
        title: "Endorsement sent",
        description: "You have successfully endorsed this user",
      })
    } catch (error) {
      console.error("Error endorsing user:", error)
      toast({
        title: "Endorsement failed",
        description: "Failed to endorse user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {endorsements.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No endorsements yet. As you contribute to the platform, others can endorse your skills.
        </div>
      ) : (
        endorsements.map((endorsement) => (
          <div key={endorsement.id} className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={endorsement.from.avatar || "/placeholder.svg"} alt={endorsement.from.name} />
                <AvatarFallback>{endorsement.from.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{endorsement.from.name}</div>
                    <div className="text-xs text-muted-foreground">@{endorsement.from.username}</div>
                  </div>
                  <Badge variant="outline">{endorsement.skill}</Badge>
                </div>
                <div className="mt-2 text-sm">"{endorsement.reason}"</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Endorsed on {endorsement.date}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleEndorseBack(endorsement.from.username)}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Endorse Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
