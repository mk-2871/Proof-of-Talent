"use client"

import { Card } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function ProposalsChart() {
  // Mock data for proposals chart
  const data = [
    { month: "Jan", proposals: 5, votes: 120 },
    { month: "Feb", proposals: 8, votes: 180 },
    { month: "Mar", proposals: 12, votes: 240 },
    { month: "Apr", proposals: 15, votes: 320 },
    { month: "May", proposals: 18, votes: 400 },
    { month: "Jun", proposals: 22, votes: 480 },
  ]

  return (
    <Card className="p-4">
      <Chart className="h-[300px]">
        <ChartLegend className="justify-center mb-4">
          <ChartLegendItem name="Proposals" color="#ec4899" />
          <ChartLegendItem name="Votes" color="#06b6d4" />
        </ChartLegend>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="proposals" stroke="#ec4899" activeDot={{ r: 8 }} />
              <Line yAxisId="right" type="monotone" dataKey="votes" stroke="#06b6d4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Chart>
    </Card>
  )
}
