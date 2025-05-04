"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWallet } from "@/components/connect-wallet"
import { GeneralSettings } from "@/components/settings/general-settings"
import { AuthenticationSettings } from "@/components/settings/authentication-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { useWeb3 } from "@/components/web3-provider"
import { AlertCircle, CheckCircle, SettingsIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Settings() {
  const { isConnected, chainId } = useWeb3()
  const [activeTab, setActiveTab] = useState("general")

  // Check if on Sepolia testnet (chainId 11155111)
  const isOnSepolia = chainId === 11155111

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences and wallet connections</p>
        </div>
        <ConnectWallet />
      </div>

      {isConnected ? (
        <>
          {!isOnSepolia && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Wrong Network</AlertTitle>
              <AlertDescription>
                Please switch to Sepolia testnet to use all features of this platform.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Update your profile information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneralSettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="authentication">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Authentication Settings
                  </CardTitle>
                  <CardDescription>Manage your wallet connections and linked accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthenticationSettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>Manage your account preferences and data</CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Please connect your wallet to access settings</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-12">
            <ConnectWallet />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
