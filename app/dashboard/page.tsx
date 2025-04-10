"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getSubmissionsStats,
  getUniversityDistribution,
  getStatusDistribution,
  getTerminationReasonDistribution,
  getTimelineData,
  getLawEnforcementData,
  getLegalConsultationData,
  getImmediatePlansData,
} from "@/app/actions/form-actions"
import {
  getAcademicLevelData,
  getFingerprintingData,
  getArrestData,
  getH1BStatusData,
  getLegalCaseStatusData,
  getIncidentTypeData,
  getNotificationMethodData,
} from "@/app/actions/additional-data-actions"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UniversityDistributionChart } from "@/components/dashboard/university-distribution-chart"
import { StatusDistributionChart } from "@/components/dashboard/status-distribution-chart"
import { TerminationReasonChart } from "@/components/dashboard/termination-reason-chart"
import { TimelineChart } from "@/components/dashboard/timeline-chart"
import { LawEnforcementChart } from "@/components/dashboard/law-enforcement-chart"
import { LegalConsultationChart } from "@/components/dashboard/legal-consultation-chart"
import { ImmediatePlansChart } from "@/components/dashboard/immediate-plans-chart"
import { AcademicLevelChart } from "@/components/dashboard/academic-level-chart"
import { FingerprintingChart } from "@/components/dashboard/fingerprinting-chart"
import { ArrestChart } from "@/components/dashboard/arrest-chart"
import { H1BStatusChart } from "@/components/dashboard/h1b-status-chart"
import { LegalCaseStatusChart } from "@/components/dashboard/legal-case-status-chart"
import { IncidentTypeChart } from "@/components/dashboard/incident-type-chart"
import { NotificationMethodChart } from "@/components/dashboard/notification-method-chart"
import { ChartSkeleton } from "@/components/dashboard/chart-skeleton"
import { EmailVerification } from "@/components/dashboard/email-verification"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    sevisTerminated: 0,
    visaRevoked: 0,
  })
  const [universityDistribution, setUniversityDistribution] = useState([])
  const [statusDistribution, setStatusDistribution] = useState([])
  const [terminationReasonDistribution, setTerminationReasonDistribution] = useState([])
  const [timelineData, setTimelineData] = useState([])
  const [lawEnforcementData, setLawEnforcementData] = useState([])
  const [legalConsultationData, setLegalConsultationData] = useState([])
  const [immediatePlansData, setImmediatePlansData] = useState([])
  const [academicLevelData, setAcademicLevelData] = useState([])
  const [fingerprintingData, setFingerprintingData] = useState([])
  const [arrestData, setArrestData] = useState([])
  const [h1bStatusData, setH1bStatusData] = useState([])
  const [legalCaseStatusData, setLegalCaseStatusData] = useState([])
  const [incidentTypeData, setIncidentTypeData] = useState([])
  const [notificationMethodData, setNotificationMethodData] = useState([])

  useEffect(() => {
    // Check if user is already verified from session storage
    const isAlreadyVerified = sessionStorage.getItem("dashboardVerified") === "true"
    setIsVerified(isAlreadyVerified)

    // Only fetch data if verified
    if (isAlreadyVerified) {
      fetchDashboardData()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [
        statsData,
        universityData,
        statusData,
        reasonData,
        timeline,
        lawData,
        legalData,
        plansData,
        academicData,
        fingerprintData,
        arrestInfo,
        h1bData,
        caseStatusData,
        incidentData,
        notificationData,
      ] = await Promise.all([
        getSubmissionsStats(),
        getUniversityDistribution(),
        getStatusDistribution(),
        getTerminationReasonDistribution(),
        getTimelineData(),
        getLawEnforcementData(),
        getLegalConsultationData(),
        getImmediatePlansData(),
        getAcademicLevelData(),
        getFingerprintingData(),
        getArrestData(),
        getH1BStatusData(),
        getLegalCaseStatusData(),
        getIncidentTypeData(),
        getNotificationMethodData(),
      ])

      // Update state with fetched data
      setStats(statsData)
      setUniversityDistribution(universityData)
      setStatusDistribution(statusData)
      setTerminationReasonDistribution(reasonData)
      setTimelineData(timeline)
      setLawEnforcementData(lawData)
      setLegalConsultationData(legalData)
      setImmediatePlansData(plansData)
      setAcademicLevelData(academicData)
      setFingerprintingData(fingerprintData)
      setArrestData(arrestInfo)
      setH1bStatusData(h1bData)
      setLegalCaseStatusData(caseStatusData)
      setIncidentTypeData(incidentData)
      setNotificationMethodData(notificationData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSuccess = () => {
    setIsVerified(true)
    fetchDashboardData()
  }

  return (
    <>
      {!isVerified && <EmailVerification onVerificationSuccess={handleVerificationSuccess} />}

      <div className={`transition-all duration-300 ${!isVerified ? "filter blur-md pointer-events-none" : ""}`}>
        <DashboardShell>
          <DashboardHeader
            heading="F-1 Student Data Dashboard"
            text="Anonymized and aggregated data about SEVIS terminations and F-1 visa revocations."
          />

          <div className="grid gap-6">
            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
            ) : (
              <DashboardStats stats={stats} />
            )}

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="flex flex-wrap w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="details" className="flex-1">Detailed Analysis</TabsTrigger>
                <TabsTrigger value="additional" className="flex-1">Additional Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                  <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Timeline of Reported Incidents</CardTitle>
                      <CardDescription>
                        Number of reported SEVIS terminations and visa revocations by month
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px] md:h-[400px]">
                      {loading ? <ChartSkeleton /> : <TimelineChart data={timelineData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>University Distribution</CardTitle>
                      <CardDescription>Number of reports per university</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? (
                        <ChartSkeleton />
                      ) : (
                        <UniversityDistributionChart data={universityDistribution || []} />
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Status at Time of Incident</CardTitle>
                      <CardDescription>Distribution by student status</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <StatusDistributionChart data={statusDistribution || []} />}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reasons for Termination/Revocation</CardTitle>
                      <CardDescription>Breakdown of cited reasons</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? (
                        <ChartSkeleton />
                      ) : (
                        <TerminationReasonChart data={terminationReasonDistribution || []} />
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Link to Law Enforcement Interaction</CardTitle>
                      <CardDescription>Was the termination/revocation linked to law enforcement?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <LawEnforcementChart data={lawEnforcementData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Attorney Consultation</CardTitle>
                      <CardDescription>Have students consulted with an immigration attorney?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <LegalConsultationChart data={legalConsultationData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Immediate Plans</CardTitle>
                      <CardDescription>What are students planning to do next?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <ImmediatePlansChart data={immediatePlansData || []} />}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Academic Level</CardTitle>
                      <CardDescription>
                        Distribution by academic level (for students in academic programs)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <AcademicLevelChart data={academicLevelData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Fingerprinting Status</CardTitle>
                      <CardDescription>Were students fingerprinted related to their incident?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <FingerprintingChart data={fingerprintingData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Arrest Status</CardTitle>
                      <CardDescription>Were students arrested related to their incident?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <ArrestChart data={arrestData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>H1B Lottery Status</CardTitle>
                      <CardDescription>Current fiscal year H1B lottery status</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <H1BStatusChart data={h1bStatusData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Legal Case Status</CardTitle>
                      <CardDescription>Current status of related legal cases</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <LegalCaseStatusChart data={legalCaseStatusData || []} />}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Type</CardTitle>
                      <CardDescription>Types of incidents related to law enforcement interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <IncidentTypeChart data={incidentTypeData || []} />}
                    </CardContent>
                  </Card>

                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>SEVIS Notification Method</CardTitle>
                      <CardDescription>How students were notified of their SEVIS termination</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] sm:h-[350px]">
                      {loading ? <ChartSkeleton /> : <NotificationMethodChart data={notificationMethodData || []} />}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>Important Disclaimer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base">
                  This dashboard presents user-reported data for informational and advocacy purposes only. The data may
                  contain inaccuracies, is not exhaustive, and <strong>does not constitute legal advice</strong>. If you
                  are experiencing immigration issues, please consult with a qualified immigration attorney.
                </p>
              </CardContent>
            </Card>
          </div>
        </DashboardShell>
      </div>
    </>
  )
}
