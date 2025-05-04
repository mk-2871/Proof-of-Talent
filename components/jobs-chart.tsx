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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function JobsChart() {
  // Mock data for jobs chart
  const data = [
    { month: "Jan", posted: 15, completed: 8 },
    { month: "Feb", posted: 20, completed: 12 },
    { month: "Mar", posted: 25, completed: 18 },
    { month: "Apr", posted: 30, completed: 22 },
    { month: "May", posted: 35, completed: 28 },
    { month: "Jun", posted: 40, completed: 32 },
  ]

  return (
    <Card className="p-4">
      <Chart className="h-[300px]">
        <ChartLegend className="justify-center mb-4">
          <ChartLegendItem name="Jobs Posted" color="#8b5cf6" />
          <ChartLegendItem name="Jobs Completed" color="#10b981" />
        </ChartLegend>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="posted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Chart>
    </Card>
  )
}
