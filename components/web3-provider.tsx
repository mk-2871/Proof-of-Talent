"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

type Web3ContextType = {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  signMessage: (message: string) => Promise<string>
  sendTransaction: (to: string, amount: string) => Promise<ethers.TransactionResponse>
  switchToSepolia: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  address: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  signMessage: async () => "",
  sendTransaction: async () => ({}) as ethers.TransactionResponse,
  switchToSepolia: async () => {},
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Sepolia testnet chain ID
  const SEPOLIA_CHAIN_ID = 11155111

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined
  }

  // Connect to MetaMask
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)

      // Request account access
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await browserProvider.send("eth_requestAccounts", [])

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const userSigner = await browserProvider.getSigner()
      const userAddress = await userSigner.getAddress()
      const network = await browserProvider.getNetwork()
      const userChainId = Number(network.chainId)

      setProvider(browserProvider)
      setSigner(userSigner)
      setAddress(userAddress)
      setChainId(userChainId)
      setIsConnected(true)

      // Check if on Sepolia, if not prompt to switch
      if (userChainId !== SEPOLIA_CHAIN_ID) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Sepolia testnet",
          action: (
            <Button variant="outline" size="sm" onClick={switchToSepolia}>
              Switch
            </Button>
          ),
        })
      }

      localStorage.setItem("isConnected", "true")
    } catch (error) {
      console.error("Error connecting to MetaMask:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect from MetaMask
  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setChainId(null)
    setIsConnected(false)
    localStorage.removeItem("isConnected")
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Sign a message
  const signMessage = async (message: string): Promise<string> => {
    if (!signer) {
      throw new Error("No signer available")
    }

    try {
      const signature = await signer.signMessage(message)
      toast({
        title: "Message Signed",
        description: "Your message has been signed successfully",
      })
      return signature
    } catch (error) {
      console.error("Error signing message:", error)
      toast({
        title: "Signing Error",
        description: "Failed to sign message",
        variant: "destructive",
      })
      throw error
    }
  }

  // Send a transaction
  const sendTransaction = async (to: string, amount: string): Promise<ethers.TransactionResponse> => {
    if (!signer) {
      throw new Error("No signer available")
    }

    try {
      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
      })

      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash.substring(0, 10)}...`,
      })

      return tx
    } catch (error) {
      console.error("Error sending transaction:", error)
      toast({
        title: "Transaction Error",
        description: "Failed to send transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  // Switch to Sepolia testnet
  const switchToSepolia = async () => {
    if (!isMetaMaskInstalled()) {
      return
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
      })

      // Update chain ID after switching
      if (provider) {
        const network = await provider.getNetwork()
        setChainId(Number(network.chainId))

        toast({
          title: "Network Switched",
          description: "Successfully switched to Sepolia testnet",
        })
      }
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          })

          toast({
            title: "Network Added",
            description: "Sepolia testnet has been added to your wallet",
          })
        } catch (addError) {
          console.error("Error adding Sepolia chain:", addError)
          toast({
            title: "Network Error",
            description: "Failed to add Sepolia network",
            variant: "destructive",
          })
        }
      } else {
        console.error("Error switching to Sepolia:", error)
        toast({
          title: "Network Error",
          description: "Failed to switch to Sepolia network",
          variant: "destructive",
        })
      }
    }
  }

  // Handle account and chain changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else if (accounts[0] !== address) {
          // Account changed, update state
          setAddress(accounts[0])
          toast({
            title: "Account Changed",
            description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          })
        }
      }

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = Number.parseInt(chainIdHex, 16)
        setChainId(newChainId)

        if (newChainId !== SEPOLIA_CHAIN_ID) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Sepolia testnet",
            action: (
              <Button variant="outline" size="sm" onClick={switchToSepolia}>
                Switch
              </Button>
            ),
          })
        } else {
          toast({
            title: "Network Changed",
            description: "Connected to Sepolia testnet",
          })
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Auto-connect if previously connected
      const autoConnect = async () => {
        const shouldConnect = localStorage.getItem("isConnected") === "true"
        if (shouldConnect) {
          connect()
        }
      }

      autoConnect()

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address])

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        address,
        chainId,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        signMessage,
        sendTransaction,
        switchToSepolia,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)

// Add type definition for window.ethereum
declare global {
  interface Window {
    ethereum: any
  }
}

// Button component for the toast action
function Button({
  children,
  variant,
  size,
  onClick,
}: {
  children: React.ReactNode
  variant: string
  size: string
  onClick: () => void
}) {
  return (
    <button
      className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
