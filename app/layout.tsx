import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/web3-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { NotificationProvider } from "@/components/notification-provider"
import { AuthProvider } from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Proof of Talent",
  description: "A decentralized platform for verifying skills and talents",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={true}
          storageKey="proof-of-talent-theme"
        >
          <Web3Provider>
            <AuthProvider>
              <NotificationProvider>
                <SidebarProvider>
                  <div className="flex min-h-screen">
                    <AppSidebar />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                  </div>
                  <Toaster />
                </SidebarProvider>
              </NotificationProvider>
            </AuthProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
