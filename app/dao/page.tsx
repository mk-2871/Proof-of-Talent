"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWallet } from "@/components/connect-wallet"
import { ProposalsList } from "@/components/proposals-list"
import { ProposalForm } from "@/components/proposal-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyVotes } from "@/components/my-votes"
import { ProposalResults } from "@/components/proposal-results"
import { useWeb3 } from "@/components/web3-provider"

export default function DAO() {
  const { isConnected } = useWeb3()
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">DAO Governance</h1>
          <p className="text-muted-foreground mt-1">Participate in platform governance through proposals and voting</p>
        </div>
        <ConnectWallet />
      </div>

      {isConnected ? (
        <>
          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>Create a New Proposal</CardTitle>
                <CardDescription>Submit a new proposal for the community to vote on</CardDescription>
              </CardHeader>
              <CardContent>
                <ProposalForm onCancel={() => setIsCreating(false)} />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsCreating(true)}>Create Proposal</Button>
              </div>

              <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="active">Active Proposals</TabsTrigger>
                  <TabsTrigger value="my-votes">My Votes</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Proposals</CardTitle>
                      <CardDescription>Current proposals open for voting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProposalsList />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="my-votes">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Voting History</CardTitle>
                      <CardDescription>Track your voting history on proposals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MyVotes />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="results">
                  <Card>
                    <CardHeader>
                      <CardTitle>Proposal Results</CardTitle>
                      <CardDescription>Results of completed proposals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProposalResults />
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
            <CardDescription>Please connect your wallet to participate in DAO governance</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <ConnectWallet />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
