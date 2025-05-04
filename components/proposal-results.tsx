import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function ProposalResults() {
  // Mock data for completed proposals
  const proposals = [
    {
      id: 1,
      title: "Add TypeScript as a verified skill category",
      description: "TypeScript is essential for modern web development and should be added as a verified skill.",
      creator: {
        name: "James Wilson",
        username: "jamesw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 85, no: 15, total: 100 },
      status: "passed",
      created: "Mar 15, 2023",
      ended: "Mar 30, 2023",
    },
    {
      id: 2,
      title: "Implement a token-based reward system",
      description: "We should implement a token-based reward system for active participants on the platform.",
      creator: {
        name: "Olivia Brown",
        username: "oliviab",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 42, no: 58, total: 100 },
      status: "rejected",
      created: "Mar 20, 2023",
      ended: "Apr 5, 2023",
    },
    {
      id: 3,
      title: "Add weekly community calls",
      description: "We should host weekly community calls to discuss platform updates and gather feedback.",
      creator: {
        name: "Daniel Lee",
        username: "daniell",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      votes: { yes: 72, no: 28, total: 100 },
      status: "passed",
      created: "Mar 25, 2023",
      ended: "Apr 10, 2023",
    },
  ]

  return (
    <div className="space-y-6">
      {proposals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No completed proposals yet.</div>
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
                  <Badge variant={proposal.status === "passed" ? "default" : "destructive"}>
                    {proposal.status === "passed" ? "Passed" : "Rejected"}
                  </Badge>
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
                <div className="mt-2 text-xs text-muted-foreground">Voting ended on {proposal.ended}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
