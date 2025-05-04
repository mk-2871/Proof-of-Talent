"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Award, Briefcase, CheckCircle, Users } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { isAuthenticated, isRecruiter } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to their respective dashboards
  useEffect(() => {
    if (isAuthenticated) {
      if (isRecruiter) {
        router.push("/recruiter/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isRecruiter, router])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Proof of Talent</h1>
          <p className="text-muted-foreground mt-1">
            Verify skills, build reputation, and find opportunities on the blockchain
          </p>
        </div>
        <Button asChild className="hover-effect">
          <Link href="/auth">Login / Sign Up</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified Skills</p>
                <p className="text-2xl font-bold">5,678</p>
                <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DAO Proposals</p>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Award className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Complete these steps to begin your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Create an account</h3>
                  <p className="text-sm text-muted-foreground">Sign up as a candidate or recruiter</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Connect your wallet</h3>
                  <p className="text-sm text-muted-foreground">Connect with MetaMask on Ethereum Sepolia testnet</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Complete your profile</h3>
                  <p className="text-sm text-muted-foreground">Add your details, skills, and experience</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">For Candidates</h3>
                    <p className="text-sm text-muted-foreground">Verify skills and apply for jobs</p>
                  </div>
                  <Badge>Talent</Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">Skill Verification</Badge>
                  <Badge variant="outline">Job Applications</Badge>
                  <Badge variant="outline">Endorsements</Badge>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">For Recruiters</h3>
                    <p className="text-sm text-muted-foreground">Post jobs and find talent</p>
                  </div>
                  <Badge>Hiring</Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline">Post Jobs</Badge>
                  <Badge variant="outline">Review Applications</Badge>
                  <Badge variant="outline">Shortlist</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/auth">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
