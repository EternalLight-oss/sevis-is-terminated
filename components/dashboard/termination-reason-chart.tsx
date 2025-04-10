"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface TerminationReasonChartProps {
  data: {
    name: string
    count: number
  }[]
}

export function TerminationReasonChart({ data }: TerminationReasonChartProps) {
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
    // Sort data by count in descending order
    const sortedData = [...safeData]
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        ...item,
        // Truncate long reason names
        name: item.name && item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name || "Unknown",
        count: item.count || 0,
      }))

    return (
      <ChartContainer
        config={{
          count: {
            label: "Count",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12 }} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } catch (error) {
    console.error("Error rendering TerminationReasonChart:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Error rendering chart</p>
      </div>
    )
  }
}
