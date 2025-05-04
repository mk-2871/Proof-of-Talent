import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface LeaderboardTableProps {
  type: "verified" | "endorsed" | "dao"
}

export function LeaderboardTable({ type }: LeaderboardTableProps) {
  // Mock data for leaderboard
  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 12,
      endorsements: 28,
      daoScore: 85,
      level: 15,
    },
    {
      id: 2,
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 10,
      endorsements: 22,
      daoScore: 72,
      level: 13,
    },
    {
      id: 3,
      name: "Michael Chen",
      username: "mikec",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 8,
      endorsements: 19,
      daoScore: 90,
      level: 11,
    },
    {
      id: 4,
      name: "Emma Davis",
      username: "emmad",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 7,
      endorsements: 15,
      daoScore: 65,
      level: 9,
    },
    {
      id: 5,
      name: "James Wilson",
      username: "jamesw",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 6,
      endorsements: 12,
      daoScore: 78,
      level: 8,
    },
    {
      id: 6,
      name: "Olivia Brown",
      username: "oliviab",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 5,
      endorsements: 10,
      daoScore: 60,
      level: 7,
    },
    {
      id: 7,
      name: "Daniel Lee",
      username: "daniell",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 4,
      endorsements: 8,
      daoScore: 55,
      level: 6,
    },
    {
      id: 8,
      name: "Sophia Garcia",
      username: "sophiag",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 3,
      endorsements: 6,
      daoScore: 50,
      level: 5,
    },
    {
      id: 9,
      name: "William Taylor",
      username: "williamt",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 2,
      endorsements: 4,
      daoScore: 45,
      level: 4,
    },
    {
      id: 10,
      name: "Ava Martinez",
      username: "avam",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 1,
      endorsements: 2,
      daoScore: 40,
      level: 3,
    },
  ]

  // Sort users based on the selected type
  const sortedUsers = [...users].sort((a, b) => {
    if (type === "verified") {
      return b.verifiedSkills - a.verifiedSkills
    } else if (type === "endorsed") {
      return b.endorsements - a.endorsements
    } else {
      return b.daoScore - a.daoScore
    }
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">User</div>
          <div className="col-span-3 text-center">
            {type === "verified" ? "Verified Skills" : type === "endorsed" ? "Endorsements" : "DAO Score"}
          </div>
          <div className="col-span-3 text-center">Level</div>
        </div>
        <div className="divide-y">
          {sortedUsers.map((user, index) => (
            <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-1 text-center font-bold text-muted-foreground">{index + 1}</div>
              <div className="col-span-5 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">@{user.username}</div>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <Badge variant="outline">
                  {type === "verified"
                    ? `${user.verifiedSkills} skills`
                    : type === "endorsed"
                      ? `${user.endorsements} endorsements`
                      : `${user.daoScore} points`}
                </Badge>
              </div>
              <div className="col-span-3 text-center">
                <Badge>Level {user.level}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
