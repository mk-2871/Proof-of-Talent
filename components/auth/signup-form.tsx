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
import { Checkbox } from "@/components/ui/checkbox"

interface SignupFormProps {
  userType: "candidate" | "recruiter"
  onSuccess: (role: string) => void
}

export function SignupForm({ userType, onSuccess }: SignupFormProps) {
  const { toast } = useToast()
  const { signMessage } = useWeb3()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // In a real app, you would send this data to your backend
      // For this demo, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        id: "user123",
        name: formData.name,
        email: formData.email,
        role: userType,
      }

      // Sign a message to verify wallet ownership (if wallet is connected)
      if (signMessage) {
        try {
          const message = `Register as ${userType}: ${formData.email}`
          await signMessage(message)
        } catch (error) {
          console.log("Wallet not connected or signing rejected, continuing with signup anyway")
          // Continue with signup even if signing fails
        }
      }

      // Set the user in auth context
      login(userData)

      toast({
        title: "Registration successful",
        description: `Welcome to Proof of Talent, ${formData.name}!`,
      })

      // Redirect based on role
      onSuccess(userType)
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
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
          Note: Connecting your wallet is recommended but not required for signup. You can connect it later in your
          profile settings.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          className="input-glass"
        />
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
        <Label htmlFor="password">Password</Label>
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
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          className="input-glass"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange} required />
        <label
          htmlFor="agreeToTerms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms of service and privacy policy
        </label>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !formData.agreeToTerms}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  )
}
