"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { AlertCircle, Check, Copy, ExternalLink, Loader2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function AuthenticationSettings() {
  const { toast } = useToast()
  const { address, chainId, disconnect, connect, switchToSepolia } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Mock linked accounts
  const [linkedAccounts, setLinkedAccounts] = useState({
    email: "alex@example.com",
    twitter: "",
    github: "alexj",
    discord: "",
  })

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleLinkAccount = (platform: string) => {
    setIsLoading(true)

    // Simulate linking account
    setTimeout(() => {
      setLinkedAccounts((prev) => ({
        ...prev,
        [platform]: platform === "twitter" ? "alexjohnson" : "alex_johnson",
      }))

      toast({
        title: "Account linked",
        description: `Your ${platform} account has been linked successfully.`,
      })

      setIsLoading(false)
    }, 1500)
  }

  const handleUnlinkAccount = (platform: string) => {
    setLinkedAccounts((prev) => ({
      ...prev,
      [platform]: "",
    }))

    toast({
      title: "Account unlinked",
      description: `Your ${platform} account has been unlinked.`,
    })
  }

  const handleSaveChanges = () => {
    setIsLoading(true)

    // Simulate saving
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your authentication settings have been updated.",
      })

      setIsLoading(false)
      setIsSaved(true)
    }, 1000)
  }

  // Check if on Sepolia testnet (chainId 11155111)
  const isOnSepolia = chainId === 11155111

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Wallet Connection</h3>

        {!isOnSepolia && (
          <Alert variant="warning" className="bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wrong Network</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>Please switch to Sepolia testnet to use all features of this platform.</p>
              <Button size="sm" variant="outline" onClick={switchToSepolia} className="w-fit gap-2">
                <RefreshCw className="h-4 w-4" />
                Switch to Sepolia
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="glass-panel p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">Connected Wallet</p>
              {isOnSepolia && (
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  Sepolia
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 break-all">{address}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopyAddress} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={disconnect} className="gap-2">
              Disconnect
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-connect">Auto-connect</Label>
            <p className="text-sm text-muted-foreground">Automatically connect wallet on page load</p>
          </div>
          <Switch id="auto-connect" defaultChecked />
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Linked Accounts</h3>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 glass-panel">
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{linkedAccounts.email}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <Check className="h-4 w-4" />
                Verified
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 glass-panel">
            <div>
              <p className="font-medium">Twitter</p>
              <p className="text-sm text-muted-foreground">
                {linkedAccounts.twitter ? `@${linkedAccounts.twitter}` : "Not linked"}
              </p>
            </div>
            <div className="flex gap-2">
              {linkedAccounts.twitter ? (
                <>
                  <Button size="sm" variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUnlinkAccount("twitter")}>
                    Unlink
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => handleLinkAccount("twitter")} disabled={isLoading} className="gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Link Twitter
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 glass-panel">
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-sm text-muted-foreground">
                {linkedAccounts.github ? `@${linkedAccounts.github}` : "Not linked"}
              </p>
            </div>
            <div className="flex gap-2">
              {linkedAccounts.github ? (
                <>
                  <Button size="sm" variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUnlinkAccount("github")}>
                    Unlink
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => handleLinkAccount("github")} disabled={isLoading} className="gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Link GitHub
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 glass-panel">
            <div>
              <p className="font-medium">Discord</p>
              <p className="text-sm text-muted-foreground">
                {linkedAccounts.discord ? `@${linkedAccounts.discord}` : "Not linked"}
              </p>
            </div>
            <div className="flex gap-2">
              {linkedAccounts.discord ? (
                <>
                  <Button size="sm" variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUnlinkAccount("discord")}>
                    Unlink
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => handleLinkAccount("discord")} disabled={isLoading} className="gap-2">
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Link Discord
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button onClick={handleSaveChanges} disabled={isLoading || isSaved} className="gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaved ? "Saved" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
