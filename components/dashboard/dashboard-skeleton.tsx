import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-5 w-64" />
                </CardTitle>
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>

            {Array(2)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-48" />
                    </CardTitle>
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
