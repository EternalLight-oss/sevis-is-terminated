"use client"

import type React from "react"

import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TooltipInfoProps {
  content: React.ReactNode
}

export function TooltipInfo({ content }: TooltipInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
