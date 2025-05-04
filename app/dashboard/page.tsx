"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWallet } from "@/components/connect-wallet"
import { StatsCard } from "@/components/stats-card"
import { SkillsChart } from "@/components/skills-chart"
import { JobsChart } from "@/components/jobs-chart"
import { ProposalsChart } from "@/components/proposals-chart"
import { UserActivity } from "@/components/user-activity"
import { Award, Briefcase, CheckCircle, Users } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const { isAuthenticated, isRecruiter } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or if a recruiter
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    } else if (isRecruiter) {
      router.push("/recruiter/dashboard")
    }
  }, [isAuthenticated, isRecruiter, router])

  if (!isAuthenticated || isRecruiter) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of platform metrics and activity</p>
        </div>
        <ConnectWallet />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value="1,234"
          description="+12% from last month"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Verified Skills"
          value="5,678"
          description="+8% from last month"
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Active Jobs"
          value="89"
          description="+15% from last month"
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatsCard
          title="DAO Proposals"
          value="42"
          description="+5% from last month"
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Platform metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="dao">DAO</TabsTrigger>
              </TabsList>
              <TabsContent value="skills">
                <SkillsChart />
              </TabsContent>
              <TabsContent value="jobs">
                <JobsChart />
              </TabsContent>
              <TabsContent value="dao">
                <ProposalsChart />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
