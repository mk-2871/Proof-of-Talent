"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  // Mock account data
  const accountData = {
    createdAt: "January 15, 2023",
    status: "Active",
  }

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    skillVerifications: true,
    endorsements: true,
    jobUpdates: true,
    daoProposals: false,
    marketingEmails: false,
  })

  const handleToggle = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
    setIsSaved(false)
  }

  const handleSaveChanges = () => {
    setIsLoading(true)

    // Simulate saving
    setTimeout(() => {
      toast({
        title: "Settings saved",
        description: "Your account settings have been updated.",
      })

      setIsLoading(false)
      setIsSaved(true)
    }, 1000)
  }

  const handleDeleteAccount = () => {
    setIsLoading(true)

    // Simulate account deletion
    setTimeout(() => {
      setIsDeleteDialogOpen(false)
      setIsLoading(false)

      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
        variant: "destructive",
      })

      // In a real app, you would redirect to a logout page or home
    }, 2000)
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Information</h3>

        <div className="glass-panel p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium">{accountData.createdAt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Status</p>
              <p className="font-medium">{accountData.status}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Email Preferences</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notificationSettings.emailNotifications}
              onCheckedChange={() => handleToggle("emailNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="skill-verifications">Skill Verifications</Label>
              <p className="text-sm text-muted-foreground">Notifications about skill verification status</p>
            </div>
            <Switch
              id="skill-verifications"
              checked={notificationSettings.skillVerifications}
              onCheckedChange={() => handleToggle("skillVerifications")}
              disabled={!notificationSettings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="endorsements">Endorsements</Label>
              <p className="text-sm text-muted-foreground">Notifications when you receive endorsements</p>
            </div>
            <Switch
              id="endorsements"
              checked={notificationSettings.endorsements}
              onCheckedChange={() => handleToggle("endorsements")}
              disabled={!notificationSettings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="job-updates">Job Updates</Label>
              <p className="text-sm text-muted-foreground">Notifications about job applications and offers</p>
            </div>
            <Switch
              id="job-updates"
              checked={notificationSettings.jobUpdates}
              onCheckedChange={() => handleToggle("jobUpdates")}
              disabled={!notificationSettings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dao-proposals">DAO Proposals</Label>
              <p className="text-sm text-muted-foreground">Notifications about new DAO proposals</p>
            </div>
            <Switch
              id="dao-proposals"
              checked={notificationSettings.daoProposals}
              onCheckedChange={() => handleToggle("daoProposals")}
              disabled={!notificationSettings.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={notificationSettings.marketingEmails}
              onCheckedChange={() => handleToggle("marketingEmails")}
              disabled={!notificationSettings.emailNotifications}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Danger Zone</h3>

        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Delete Account</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-fit gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Please type <span className="font-medium">delete my account</span> to confirm.
                  </p>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="delete my account"
                    className="input-glass"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== "delete my account" || isLoading}
                    className="gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </AlertDescription>
        </Alert>
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
