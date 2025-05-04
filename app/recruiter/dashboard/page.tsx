"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { RecruiterStats } from "@/components/recruiter/recruiter-stats"
import { RecentApplications } from "@/components/recruiter/recent-applications"
import { ShortlistedCandidates } from "@/components/recruiter/shortlisted-candidates"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function RecruiterDashboard() {
  const { user, isRecruiter, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated or not a recruiter
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    } else if (!isRecruiter) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isRecruiter, router])

  if (!isAuthenticated || !isRecruiter) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage job applications and shortlist candidates</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/recruiter/post-job">
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecruiterStats />
      </div>

      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="applications">Recent Applications</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted Candidates</TabsTrigger>
        </TabsList>
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>View and manage recent job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentApplications />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shortlisted">
          <Card>
            <CardHeader>
              <CardTitle>Shortlisted Candidates</CardTitle>
              <CardDescription>Candidates you've shortlisted for further consideration</CardDescription>
            </CardHeader>
            <CardContent>
              <ShortlistedCandidates />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
