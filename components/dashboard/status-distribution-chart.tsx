"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface StatusDistributionChartProps {
  data: {
    name: string
    count: number
  }[]
}

export function StatusDistributionChart({ data }: StatusDistributionChartProps) {
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

    // Map status names to shorter display names
    const processedData = filteredData.map((item) => {
      let displayName = item.name || "Unknown"
      if (item.name === "F-1 Student (Academic Program)") {
        displayName = "Academic Program"
      } else if (item.name === "F-1 Student (On Post-Completion OPT)") {
        displayName = "Post-Completion OPT"
      } else if (item.name === "F-1 Student (On STEM OPT Extension)") {
        displayName = "STEM OPT Extension"
      }

      return {
        ...item,
        displayName,
      }
    })

    const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

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
              nameKey="displayName"
              label={({ displayName, percent }) => `${displayName}: ${(percent * 100).toFixed(0)}%`}
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
    console.error("Error rendering StatusDistributionChart:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Error rendering chart</p>
      </div>
    )
  }
}
