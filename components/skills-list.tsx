"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, XCircle } from "lucide-react"

export function SkillsList() {
  const { signMessage } = useWeb3()
  const { toast } = useToast()

  // Mock data for skills
  const [skills, setSkills] = useState([
    { id: 1, name: "Solidity", status: "verified", date: "Jan 15, 2023" },
    { id: 2, name: "React", status: "verified", date: "Feb 20, 2023" },
    { id: 3, name: "Web3.js", status: "verified", date: "Mar 10, 2023" },
    { id: 4, name: "Smart Contract Auditing", status: "pending", date: "Apr 5, 2023" },
    { id: 5, name: "Rust", status: "pending", date: "Apr 18, 2023" },
    { id: 6, name: "GraphQL", status: "rejected", date: "Mar 25, 2023" },
  ])

  const handleMintCertificate = async (skillId: number) => {
    try {
      // Sign the mint certificate message
      const message = `Mint certificate for skill ID: ${skillId}`
      await signMessage(message)

      toast({
        title: "Certificate minted",
        description: "Your skill certificate has been minted as an NFT",
      })
    } catch (error) {
      console.error("Error minting certificate:", error)
      toast({
        title: "Minting failed",
        description: "Failed to mint certificate. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {skills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No skills found. Submit a skill for verification.</div>
      ) : (
        <div className="divide-y">
          {skills.map((skill) => (
            <div key={skill.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(skill.status)}
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-xs text-muted-foreground">Submitted on {skill.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(skill.status)}
                {skill.status === "verified" && (
                  <Button variant="outline" size="sm" onClick={() => handleMintCertificate(skill.id)}>
                    Mint Certificate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
