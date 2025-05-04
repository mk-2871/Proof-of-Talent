"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { ApplicationsList } from "@/components/recruiter/applications-list"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function ApplicationsPage() {
  const { isRecruiter } = useAuth()
  const router = useRouter()

  // Redirect if not a recruiter
  useEffect(() => {
    if (!isRecruiter) {
      router.push("/auth")
    }
  }, [isRecruiter, router])

  if (!isRecruiter) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-1">Review and manage all job applications</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search applications..." className="pl-8 input-glass w-full" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>Review and manage applications for all your job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationsList />
        </CardContent>
      </Card>
    </div>
  )
}
