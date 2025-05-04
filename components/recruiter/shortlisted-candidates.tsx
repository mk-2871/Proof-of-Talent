"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, MessageSquare, Star, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useApplicationStore } from "@/lib/application-store"

export function ShortlistedCandidates() {
  const { toast } = useToast()
  const { getShortlistedApplications, removeFromShortlist } = useApplicationStore()
  const shortlistedApplications = getShortlistedApplications()

  const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
  const [isMessageOpen, setIsMessageOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Message is empty",
        description: "Please enter a message to send to the candidate.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this message to your backend
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedCandidate.candidate.name}.`,
    })

    setMessage("")
    setIsMessageOpen(false)
  }

  const handleRemoveFromShortlist = (applicationId: string) => {
    removeFromShortlist(applicationId)
    toast({
      title: "Candidate removed",
      description: "The candidate has been removed from your shortlist.",
    })
  }

  return (
    <div className="space-y-4">
      {shortlistedApplications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No candidates have been shortlisted yet. Review applications to add candidates to your shortlist.
        </div>
      ) : (
        <div className="divide-y">
          {shortlistedApplications.map((application) => (
            <div key={application.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={application.candidate.avatar || "/placeholder.svg"}
                    alt={application.candidate.name}
                  />
                  <AvatarFallback>{application.candidate.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{application.candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{application.job.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <Star className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground ml-1">4.0</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Shortlisted
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCandidate(application)
                    setIsMessageOpen(true)
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleRemoveFromShortlist(application.id)}>
                  <XCircle className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedCandidate?.candidate.name} about the {selectedCandidate?.job.title} position
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                rows={6}
                className="input-glass"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
