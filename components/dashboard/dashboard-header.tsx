import type React from "react"
import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" size="sm">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        {children}
      </div>
    </div>
  )
}
