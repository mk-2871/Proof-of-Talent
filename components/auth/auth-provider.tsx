"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "candidate" | "recruiter"
} | null

type AuthContextType = {
  user: User
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  isRecruiter: boolean
  isCandidate: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isRecruiter: false,
  isCandidate: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pot_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("pot_user")
      }
    }
    setIsLoaded(true)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("pot_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pot_user")
  }

  const isAuthenticated = !!user
  const isRecruiter = isAuthenticated && user?.role === "recruiter"
  const isCandidate = isAuthenticated && user?.role === "candidate"

  // Don't render children until we've checked localStorage
  if (!isLoaded) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isRecruiter,
        isCandidate,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
