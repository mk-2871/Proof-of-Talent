"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsDown, ThumbsUp } from "lucide-react"

export function ProposalsList() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()

  // Mock data for proposals
  const [proposals, setProposals] = useState([
    {
      id: 1,
      title: "Add Rust as a verified skill category",
      description:
        "Rust is becoming increasingly important in the blockchain space, especially with the rise of Solana and Near. We should add it as a verified skill category.",
      creator: {
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 78, no: 22, total: 100 },
      userVote: null,
      deadline: "May 1, 2023",
      created: "Apr 15, 2023",
    },
    {
      id: 2,
      title: "Increase verification rewards by 20%",
      description:
        "To incentivize more skill verifications, we should increase the rewards for verifiers by 20%. This will help grow the platform's verified skill base.",
      creator: {
        name: "Michael Chen",
        username: "mikec",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 65, no: 35, total: 100 },
      userVote: null,
      deadline: "May 5, 2023",
      created: "Apr 18, 2023",
    },
    {
      id: 3,
      title: "Add community moderator role",
      description:
        "We should create a community moderator role to help manage the growing platform. Moderators would help verify skills and review reported content.",
      creator: {
        name: "Emma Davis",
        username: "emmad",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 92, no: 8, total: 100 },
      userVote: null,
      deadline: "Apr 30, 2023",
      created: "Apr 20, 2023",
    },
  ])

  const handleVote = async (proposalId: number, vote: "yes" | "no") => {
    try {
      // Sign the vote message
      const message = `Vote ${vote} on proposal ID: ${proposalId}`
      await signMessage(message)

      // Update proposal votes
      setProposals((prev) =>
        prev.map((proposal) => {
          if (proposal.id === proposalId) {
            const newVotes = { ...proposal.votes }

            // If user already voted, remove their previous vote
            if (proposal.userVote) {
              newVotes[proposal.userVote] -= 1
            } else {
              newVotes.total += 1
            }

            // Add new vote
            newVotes[vote] += 1

            // Calculate percentages
            const yesPercent = Math.round((newVotes.yes / newVotes.total) * 100)
            const noPercent = 100 - yesPercent

            return {
              ...proposal,
              votes: {
                yes: newVotes.yes,
                no: newVotes.no,
                total: newVotes.total,
              },
              userVote: vote,
            }
          }
          return proposal
        }),
      )

      toast({
        title: "Vote recorded",
        description: `You voted ${vote} on the proposal`,
      })
    } catch (error) {
      console.error("Error voting on proposal:", error)
      toast({
        title: "Voting failed",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {proposals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No active proposals at the moment.</div>
      ) : (
        proposals.map((proposal) => (
          <div key={proposal.id} className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={proposal.creator.avatar || "/placeholder.svg"} alt={proposal.creator.name} />
                <AvatarFallback>{proposal.creator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{proposal.title}</div>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Proposed by @{proposal.creator.username} on {proposal.created}
                </div>
                <div className="mt-2 text-sm">{proposal.description}</div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Yes: {proposal.votes.yes} votes ({Math.round((proposal.votes.yes / proposal.votes.total) * 100)}%)
                    </span>
                    <span>
                      No: {proposal.votes.no} votes ({Math.round((proposal.votes.no / proposal.votes.total) * 100)}%)
                    </span>
                  </div>
                  <div className="flex gap-2 h-2">
                    <div
                      className="bg-green-500 rounded-l-full"
                      style={{ width: `${Math.round((proposal.votes.yes / proposal.votes.total) * 100)}%` }}
                    />
                    <div
                      className="bg-red-500 rounded-r-full"
                      style={{ width: `${Math.round((proposal.votes.no / proposal.votes.total) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Deadline: {proposal.deadline}</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={proposal.userVote === "yes" ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => handleVote(proposal.id, "yes")}
                      disabled={proposal.userVote !== null}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      Yes
                    </Button>
                    <Button
                      variant={proposal.userVote === "no" ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => handleVote(proposal.id, "no")}
                      disabled={proposal.userVote !== null}
                    >
                      <ThumbsDown className="h-3 w-3" />
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
