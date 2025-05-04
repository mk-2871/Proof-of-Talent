import { Badge } from "@/components/ui/badge"

export function RecentProposals() {
  // Mock data for recent proposals
  const proposals = [
    {
      id: 1,
      title: "Add Rust as a verified skill category",
      status: "Active",
      votes: { yes: 78, no: 22 },
      deadline: "2 days left",
    },
    {
      id: 2,
      title: "Increase verification rewards by 20%",
      status: "Active",
      votes: { yes: 65, no: 35 },
      deadline: "5 days left",
    },
    {
      id: 3,
      title: "Add community moderator role",
      status: "Active",
      votes: { yes: 92, no: 8 },
      deadline: "1 day left",
    },
  ]

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{proposal.title}</h3>
            <Badge variant={proposal.status === "Active" ? "default" : "secondary"}>{proposal.status}</Badge>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Yes: {proposal.votes.yes}%</span>
              <span>No: {proposal.votes.no}%</span>
            </div>
            <div className="flex gap-2 h-2">
              <div className="bg-green-500 rounded-l-full" style={{ width: `${proposal.votes.yes}%` }} />
              <div className="bg-red-500 rounded-r-full" style={{ width: `${proposal.votes.no}%` }} />
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{proposal.deadline}</div>
        </div>
      ))}
    </div>
  )
}
