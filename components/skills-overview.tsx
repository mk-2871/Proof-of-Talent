import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function SkillsOverview() {
  // Mock data for skills overview
  const topSkills = [
    { name: "Solidity", count: 342, growth: 15 },
    { name: "React", count: 289, growth: 8 },
    { name: "Web3.js", count: 256, growth: 12 },
    { name: "Smart Contract Auditing", count: 187, growth: 20 },
    { name: "TypeScript", count: 165, growth: 5 },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Top Verified Skills</div>
        <div className="grid gap-3">
          {topSkills.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{skill.name}</Badge>
                <span className="text-xs text-muted-foreground">{skill.count} verifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={skill.growth * 5} className="h-2 w-16" />
                <span className="text-xs text-green-500">+{skill.growth}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
