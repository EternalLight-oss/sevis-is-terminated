"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface TimelineChartProps {
  data: {
    name: string
    sevis: number
    visa: number
  }[]
}

export function TimelineChart({ data }: TimelineChartProps) {
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
    // Ensure all data points have the required properties
    const processedData = safeData.map((item) => ({
      name: item.name || "Unknown",
      sevis: item.sevis || 0,
      visa: item.visa || 0,
    }))

    return (
      <ChartContainer
        config={{
          sevis: {
            label: "SEVIS Terminations",
            color: "hsl(var(--chart-1))",
          },
          visa: {
            label: "Visa Revocations",
            color: "hsl(var(--chart-2))",
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="sevis" fill="var(--color-sevis)" />
            <Bar dataKey="visa" fill="var(--color-visa)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  } catch (error) {
    console.error("Error rendering TimelineChart:", error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Error rendering chart</p>
      </div>
    )
  }
}
