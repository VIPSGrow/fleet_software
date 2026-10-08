import { Suspense } from 'react'
import { KPICards } from './_components/kpi-cards'
import { RecentTrips } from './_components/recent-trips'
import { ComplianceAlerts } from './_components/compliance-alerts'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Fleet overview and key metrics
        </p>
      </div>

      <Suspense fallback={<div>Loading KPIs...</div>}>
        <KPICards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div>Loading recent trips...</div>}>
          <RecentTrips />
        </Suspense>

        <Suspense fallback={<div>Loading compliance alerts...</div>}>
          <ComplianceAlerts />
        </Suspense>
      </div>
    </div>
  )
}
