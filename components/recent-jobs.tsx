import { Badge } from "@/components/ui/badge"

export function RecentJobs() {
  // Mock data for recent jobs
  const jobs = [
    {
      id: 1,
      title: "Smart Contract Developer",
      company: "DeFi Protocol",
      location: "Remote",
      budget: "0.5 ETH",
      skills: ["Solidity", "ERC-20", "DeFi"],
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "NFT Marketplace",
      location: "Remote",
      budget: "0.3 ETH",
      skills: ["React", "Web3", "UI/UX"],
      posted: "3 days ago",
    },
    {
      id: 3,
      title: "Blockchain Security Auditor",
      company: "Security DAO",
      location: "Remote",
      budget: "0.8 ETH",
      skills: ["Security", "Auditing", "Solidity"],
      posted: "5 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-muted-foreground">
                {job.company} - {job.location}
              </p>
            </div>
            <Badge>{job.budget}</Badge>
          </div>
          <div className="flex gap-2 mt-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Posted {job.posted}</div>
        </div>
      ))}
    </div>
  )
}
