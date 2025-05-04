import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Leaderboard() {
  // Mock data for leaderboard
  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexj",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 12,
      endorsements: 28,
      level: 15,
    },
    {
      id: 2,
      name: "Sarah Williams",
      username: "sarahw",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 10,
      endorsements: 22,
      level: 13,
    },
    {
      id: 3,
      name: "Michael Chen",
      username: "mikec",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 8,
      endorsements: 19,
      level: 11,
    },
    {
      id: 4,
      name: "Emma Davis",
      username: "emmad",
      avatar: "/placeholder.svg?height=40&width=40",
      verifiedSkills: 7,
      endorsements: 15,
      level: 9,
    },
  ]

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
          <div className="font-bold text-muted-foreground w-6 text-center">{index + 1}</div>
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="outline" className="text-xs">
              Level {user.level}
            </Badge>
            <div className="text-xs text-muted-foreground">
              {user.verifiedSkills} skills · {user.endorsements} endorsements
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
