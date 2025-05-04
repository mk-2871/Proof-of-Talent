"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { ShortlistedCandidates } from "@/components/recruiter/shortlisted-candidates"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function ShortlistPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">Shortlisted Candidates</h1>
          <p className="text-muted-foreground mt-1">Manage your shortlisted candidates</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search candidates..." className="pl-8 input-glass w-full" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shortlisted Candidates</CardTitle>
          <CardDescription>Candidates you've shortlisted for further consideration</CardDescription>
        </CardHeader>
        <CardContent>
          <ShortlistedCandidates />
        </CardContent>
      </Card>
    </div>
  )
}
