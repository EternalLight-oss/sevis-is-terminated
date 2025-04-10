import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  stats: {
    totalSubmissions: number
    sevisTerminated: number
    visaRevoked: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  // Ensure stats is defined with default values
  const safeStats = stats || { totalSubmissions: 0, sevisTerminated: 0, visaRevoked: 0 }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">Total submissions received</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SEVIS Terminations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.sevisTerminated}</div>
          <p className="text-xs text-muted-foreground">Reported SEVIS terminations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visa Revocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStats.visaRevoked}</div>
          <p className="text-xs text-muted-foreground">Reported visa revocations</p>
        </CardContent>
      </Card>
    </div>
  )
}
