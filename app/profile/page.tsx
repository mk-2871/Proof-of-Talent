"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWallet } from "@/components/connect-wallet"
import { ProfileForm } from "@/components/profile-form"
import { SkillsList } from "@/components/skills-list"
import { EndorsementsList } from "@/components/endorsements-list"
import { JobHistory } from "@/components/job-history"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Edit, Star, Trophy } from "lucide-react"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const { address, isConnected } = useWeb3()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const user = {
    name: "Alex Johnson",
    username: "alexj",
    bio: "Blockchain developer and smart contract auditor with 5+ years of experience in DeFi and NFT projects.",
    avatar: "/placeholder.svg?height=100&width=100",
    banner: "/placeholder.svg?height=200&width=800",
    level: 12,
    xp: 1250,
    nextLevelXp: 1500,
    skills: [
      { id: 1, name: "Solidity", status: "verified" },
      { id: 2, name: "React", status: "verified" },
      { id: 3, name: "Web3.js", status: "verified" },
      { id: 4, name: "Smart Contract Auditing", status: "pending" },
      { id: 5, name: "Rust", status: "pending" },
    ],
    badges: [
      { id: 1, name: "Top Verified", icon: <Award className="h-4 w-4" /> },
      { id: 2, name: "Expert", icon: <Trophy className="h-4 w-4" /> },
      { id: 3, name: "5+ Endorsements", icon: <Star className="h-4 w-4" /> },
    ],
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile, skills, and reputation</p>
        </div>
        <ConnectWallet />
      </div>

      {isConnected ? (
        <>
          <Card className="glass-card overflow-hidden">
            <div
              className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"
              style={{
                backgroundImage: `url(${user.banner})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center -mt-12">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-12 md:pt-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Level {user.level}
                        </Badge>
                        {user.badges.map((badge) => (
                          <Badge key={badge.id} variant="secondary" className="text-xs flex items-center gap-1">
                            {badge.icon}
                            {badge.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={handleEditProfile} size="sm" className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>
                        XP: {user.xp}/{user.nextLevelXp}
                      </span>
                      <span>{Math.round((user.xp / user.nextLevelXp) * 100)}%</span>
                    </div>
                    <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Bio</h3>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <h3 className="font-medium w-full mb-1">Verified Skills</h3>
                {user.skills
                  .filter((skill) => skill.status === "verified")
                  .map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </Card>

          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
                <TabsTrigger value="jobs">Job History</TabsTrigger>
              </TabsList>
              <TabsContent value="skills">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Certifications</CardTitle>
                    <CardDescription>Manage your skills and certification status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SkillsList />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="endorsements">
                <Card>
                  <CardHeader>
                    <CardTitle>Endorsements</CardTitle>
                    <CardDescription>Endorsements you've received from other users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EndorsementsList />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="jobs">
                <Card>
                  <CardHeader>
                    <CardTitle>Job History</CardTitle>
                    <CardDescription>Your job application and completion history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JobHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to view and manage your profile</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <ConnectWallet />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
