"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { useAuth } from "@/components/auth/auth-provider"

interface LoginFormProps {
  userType: "candidate" | "recruiter"
  onSuccess: (role: string) => void
}

export function LoginForm({ userType, onSuccess }: LoginFormProps) {
  const { toast } = useToast()
  const { signMessage } = useWeb3()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would validate credentials against a backend
      // For this demo, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock login data
      const userData = {
        id: "user123",
        name: userType === "recruiter" ? "Sarah Williams" : "Alex Johnson",
        email: formData.email,
        role: userType,
      }

      // Sign a message to verify wallet ownership (if wallet is connected)
      if (signMessage) {
        try {
          const message = `Login as ${userType}: ${formData.email}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing with login anyway")
          // Continue with login even if signing fails
        }
      }

      // Set the user in auth context
      login(userData)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Redirect based on role
      onSuccess(userType)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-sm rounded-md">
        <p>
          Note: Connecting your wallet is recommended but not required for login. You can connect it later in your
          profile settings.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          className="input-glass"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" className="text-sm text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="input-glass"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
