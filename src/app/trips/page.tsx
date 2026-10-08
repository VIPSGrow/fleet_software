import { Suspense } from 'react'
import { TripTable } from './_components/trip-table'
import { TripForm } from './_components/trip-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trip & Revenue Register</h1>
          <p className="text-muted-foreground">Manage trips and revenue</p>
        </div>
        <Link href="/trips/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading trips...</div>}>
        <TripsContent />
      </Suspense>
    </div>
  )
}

async function TripsContent() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/trips?limit=50`, {
    cache: 'no-store',
  })
  const data = await res.json()
  const trips = data.trips || []

  return <TripTable trips={trips} onTripUpdated={() => window.location.reload()} />
}
