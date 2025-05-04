"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [userType, setUserType] = useState<"candidate" | "recruiter">("candidate")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isRecruiter } = useAuth()

  // Check if there's a tab parameter in the URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isRecruiter) {
        router.push("/recruiter/dashboard")
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isRecruiter, router])

  const handleUserTypeChange = (type: "candidate" | "recruiter") => {
    setUserType(type)
  }

  const handleAuthSuccess = (role: string) => {
    if (role === "recruiter") {
      router.push("/recruiter/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  if (isAuthenticated) {
    return null // Don't render anything while redirecting
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader>
          <CardTitle className="text-center">
            {activeTab === "login" ? "Login" : "Sign Up"} as {userType === "candidate" ? "Candidate" : "Recruiter"}
          </CardTitle>
          <CardDescription className="text-center">
            {activeTab === "login"
              ? "Enter your credentials to access your account"
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Tabs
              defaultValue={userType}
              className="w-full"
              onValueChange={(value) => handleUserTypeChange(value as "candidate" | "recruiter")}
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="candidate">Candidate</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm userType={userType} onSuccess={handleAuthSuccess} />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm userType={userType} onSuccess={handleAuthSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setActiveTab("signup")}
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-primary underline underline-offset-4 hover:text-primary/90"
              >
                Login
              </button>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
