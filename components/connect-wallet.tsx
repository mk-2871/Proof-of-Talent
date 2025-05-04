"use client"

import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { Loader2, Wallet } from "lucide-react"
import { useState } from "react"

export function ConnectWallet() {
  const { isConnected, isConnecting, connect, address } = useWeb3()
  const [isHovering, setIsHovering] = useState(false)

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        className="gap-2 rounded-xl hover-effect"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Wallet className="h-5 w-5 text-primary" />
        {isHovering ? "Disconnect" : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
      </Button>
    )
  }

  return (
    <Button onClick={connect} disabled={isConnecting} className="gap-2 rounded-xl hover-effect">
      {isConnecting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5" />}
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
