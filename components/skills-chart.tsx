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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function SkillsChart() {
  // Mock data for skills chart
  const data = [
    { month: "Jan", verified: 120, pending: 45 },
    { month: "Feb", verified: 150, pending: 60 },
    { month: "Mar", verified: 180, pending: 75 },
    { month: "Apr", verified: 220, pending: 90 },
    { month: "May", verified: 280, pending: 110 },
    { month: "Jun", verified: 350, pending: 130 },
  ]

  return (
    <Card className="p-4">
      <Chart className="h-[300px]">
        <ChartLegend className="justify-center mb-4">
          <ChartLegendItem name="Verified Skills" color="#3b82f6" />
          <ChartLegendItem name="Pending Skills" color="#f97316" />
        </ChartLegend>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="verified" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVerified)" />
              <Area type="monotone" dataKey="pending" stroke="#f97316" fillOpacity={1} fill="url(#colorPending)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Chart>
    </Card>
  )
}
