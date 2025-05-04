import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsDown, ThumbsUp } from "lucide-react"

export function MyVotes() {
  // Mock data for user's votes
  const votes = [
    {
      id: 1,
      proposal: {
        title: "Add Rust as a verified skill category",
        creator: {
          name: "Sarah Williams",
          username: "sarahw",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      vote: "yes",
      date: "Apr 16, 2023",
    },
    {
      id: 2,
      proposal: {
        title: "Increase verification rewards by 20%",
        creator: {
          name: "Michael Chen",
          username: "mikec",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      vote: "no",
      date: "Apr 19, 2023",
    },
    {
      id: 3,
      proposal: {
        title: "Add community moderator role",
        creator: {
          name: "Emma Davis",
          username: "emmad",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      },
      vote: "yes",
      date: "Apr 21, 2023",
    },
  ]

  return (
    <div className="space-y-4">
      {votes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No voting history found. Vote on proposals to see your history here.
        </div>
      ) : (
        <div className="divide-y">
          {votes.map((vote) => (
            <div key={vote.id} className="py-4 flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={vote.proposal.creator.avatar || "/placeholder.svg"}
                  alt={vote.proposal.creator.name}
                />
                <AvatarFallback>{vote.proposal.creator.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{vote.proposal.title}</div>
                  <Badge variant={vote.vote === "yes" ? "default" : "destructive"} className="flex items-center gap-1">
                    {vote.vote === "yes" ? (
                      <>
                        <ThumbsUp className="h-3 w-3" />
                        Yes
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-3 w-3" />
                        No
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">Proposed by @{vote.proposal.creator.username}</div>
                <div className="text-xs text-muted-foreground mt-1">Voted on {vote.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
