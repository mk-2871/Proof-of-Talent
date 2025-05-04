import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWallet } from "@/components/connect-wallet"
import { LeaderboardTable } from "@/components/leaderboard-table"

export default function LeaderboardPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">Top users ranked by various metrics</p>
        </div>
        <ConnectWallet />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Platform Leaderboard</CardTitle>
          <CardDescription>Users ranked by verification, endorsements, and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verified" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="verified">Most Verified</TabsTrigger>
              <TabsTrigger value="endorsed">Most Endorsed</TabsTrigger>
              <TabsTrigger value="dao">DAO Participation</TabsTrigger>
            </TabsList>
            <TabsContent value="verified">
              <LeaderboardTable type="verified" />
            </TabsContent>
            <TabsContent value="endorsed">
              <LeaderboardTable type="endorsed" />
            </TabsContent>
            <TabsContent value="dao">
              <LeaderboardTable type="dao" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
