"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, CheckCircle, Users } from "lucide-react"

export function RecruiterStats() {
  // Mock data for recruiter stats
  const stats = [
    {
      title: "Active Jobs",
      value: "5",
      description: "2 with new applications",
      icon: <BriefcaseIcon className="h-4 w-4" />,
    },
    {
      title: "Total Applications",
      value: "24",
      description: "8 new this week",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Shortlisted",
      value: "7",
      description: "3 pending review",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ]

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="bg-primary/10 p-2 rounded-full">{stat.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
