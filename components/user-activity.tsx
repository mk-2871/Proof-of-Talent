import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserActivity() {
  // Mock data for user activity
  const activities = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        username: "alexj",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "verified a skill",
      target: "Solidity",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: {
        name: "Sarah Williams",
        username: "sarahw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "posted a job",
      target: "Smart Contract Developer",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: {
        name: "Michael Chen",
        username: "mikec",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "created a proposal",
      target: "Add Rust as a verified skill",
      time: "3 hours ago",
    },
    {
      id: 4,
      user: {
        name: "Emma Davis",
        username: "emmad",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "endorsed",
      target: "Alex Johnson",
      time: "5 hours ago",
    },
    {
      id: 5,
      user: {
        name: "James Wilson",
        username: "jamesw",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      action: "completed a job",
      target: "Frontend Developer",
      time: "1 day ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
