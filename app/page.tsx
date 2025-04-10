import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">F-1 Student SEVIS & Visa Status Tracker</h1>
          <p className="text-xl text-muted-foreground">
            Anonymous data collection for international students affected by recent SEVIS terminations or visa
            revocations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Information</CardTitle>
              <CardDescription>
                Anonymously share your experience to help build a clearer picture of recent F-1 visa and SEVIS issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is our priority. All submissions are anonymous and data is only presented in aggregate
                form.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/form" className="w-full">
                <Button className="w-full">Submit Your Information</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>View Dashboard</CardTitle>
              <CardDescription>
                Explore aggregated data visualizations of reported incidents. You'll need to verify your .edu email to
                access the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See trends, patterns, and statistics from anonymously submitted reports to better understand the current
                situation.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                  View Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Important Disclaimer</h2>
          <p className="text-muted-foreground">
            This platform collects user-reported data for informational and advocacy purposes only. The data may contain
            inaccuracies, is not exhaustive, and <strong>does not constitute legal advice</strong>. If you are
            experiencing immigration issues, please consult with a qualified immigration attorney.
          </p>
        </div>
      </div>
    </div>
  )
}
