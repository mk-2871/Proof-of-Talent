"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet } from "@/components/connect-wallet"
import { SkillVerificationForm } from "@/components/skill-verification-form"
import { SkillsList } from "@/components/skills-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationQueue } from "@/components/verification-queue"
import { useWeb3 } from "@/components/web3-provider"

export default function Skills() {
  const { isConnected } = useWeb3()
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-1">Verify your skills and get certified on the blockchain</p>
        </div>
        <ConnectWallet />
      </div>

      {isConnected ? (
        <>
          {isSubmitting ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Skill for Verification</CardTitle>
                <CardDescription>Provide details and proof of your skill for DAO verification</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillVerificationForm onCancel={() => setIsSubmitting(false)} />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsSubmitting(true)}>Submit New Skill</Button>
              </div>

              <Tabs defaultValue="my-skills" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="my-skills">My Skills</TabsTrigger>
                  <TabsTrigger value="verification-queue">Verification Queue</TabsTrigger>
                </TabsList>
                <TabsContent value="my-skills">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Skills</CardTitle>
                      <CardDescription>Manage your skills and certification status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SkillsList />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="verification-queue">
                  <Card>
                    <CardHeader>
                      <CardTitle>Verification Queue</CardTitle>
                      <CardDescription>Skills waiting for DAO verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VerificationQueue />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to manage your skills</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <ConnectWallet />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
