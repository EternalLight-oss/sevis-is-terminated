"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface LawEnforcementChartProps {
  data: {
    name: string
    count: number
  }[]
}

export function LawEnforcementChart({ data }: LawEnforcementChartProps) {
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : []

  // Handle empty data
  if (safeData.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  try {
    // Filter out zero counts to avoid empty pie segments
    const filteredData = safeData.filter((item) => item && item.count > 0)

    // If after filtering we have no data, show a message
    if (filteredData.length === 0) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      )
    }

    // Ensure all data points have the required properties
    const processedData = filteredData.map((item) => ({
      name: item.name || "Unknown",
      count: item.count || 0,
    }))

    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

    return (
      <ChartContainer className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } catch (error) {
    console.error("Error rendering LawEnforcementChart:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Error rendering chart</p>
      </div>
    )
  }
}
