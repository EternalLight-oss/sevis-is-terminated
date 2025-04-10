import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ChartSkeletonProps {
  title?: string
}

export function ChartSkeleton({ title }: ChartSkeletonProps) {
  return (
    <div className="h-full w-full">
      {title ? (
        <CardHeader className="pb-2">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-64" />
        </CardHeader>
      ) : null}
      <CardContent className="h-[300px] flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </div>
  )
}
