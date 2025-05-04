"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Award,
  BarChart3,
  Briefcase,
  CheckCircle,
  Home,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useWeb3 } from "@/components/web3-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"

export function AppSidebar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { address, disconnect } = useWeb3()
  const { user, logout, isRecruiter, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    disconnect()
  }

  // Define navigation based on user role
  const candidateNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Skills", href: "/skills", icon: CheckCircle },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "DAO", href: "/dao", icon: Award },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const recruiterNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/recruiter/dashboard", icon: BarChart3 },
    { name: "Applications", href: "/recruiter/applications", icon: Users },
    { name: "Shortlist", href: "/recruiter/shortlist", icon: CheckCircle },
    { name: "Post Job", href: "/recruiter/post-job", icon: Briefcase },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const publicNavigation = [{ name: "Home", href: "/", icon: Home }]

  const navigation = isAuthenticated ? (isRecruiter ? recruiterNavigation : candidateNavigation) : publicNavigation

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex flex-col items-center justify-center p-6">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg">PoT</span>
          </Link>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {!isAuthenticated && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === "/auth"} tooltip="Login">
                      <Link href="/auth">
                        <LogIn className="h-5 w-5" />
                        <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/auth" && pathname.includes("signup")}
                      tooltip="Sign Up"
                    >
                      <Link href="/auth?tab=signup">
                        <UserPlus className="h-5 w-5" />
                        <span>Sign Up</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    const newTheme = theme === "dark" ? "light" : "dark"
                    setTheme(newTheme)
                  }}
                  tooltip="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {isAuthenticated && user && (
          <div className="p-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
