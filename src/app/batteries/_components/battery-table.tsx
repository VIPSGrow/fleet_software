'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BatteryForm } from './battery-form'

export function BatteryTable() {
  const [batteries, setBatteries] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const fetchBatteries = async () => {
    const res = await fetch('/api/batteries')
    const data = await res.json()
    setBatteries(data.batteries || [])
  }

  useEffect(() => { fetchBatteries() }, [])

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowForm(true)}>Fit Battery</Button>
      {showForm && <BatteryForm onClose={() => setShowForm(false)} onSuccess={() => { setShowForm(false); fetchBatteries() }} />}
      <div className="rounded border">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="p-2 text-left">Vehicle</th><th className="p-2 text-left">Brand</th><th className="p-2 text-left">Model</th><th className="p-2 text-left">Serial</th><th className="p-2 text-left">Purchase Date</th><th className="p-2 text-left">Cost</th><th className="p-2 text-left">Warranty (mo)</th><th className="p-2 text-left">Fitted Odo</th><th className="p-2 text-left">Status</th></tr></thead>
          <tbody>
            {batteries.map((b) => (
              <tr key={b.id} className="border-b"><td className="p-2">{b.vehicle?.vehicleNo}</td><td className="p-2">{b.brand}</td><td className="p-2">{b.model}</td><td className="p-2">{b.serialNumber}</td><td className="p-2">{b.purchaseDate ? new Date(b.purchaseDate).toLocaleDateString() : ''}</td><td className="p-2">{b.purchaseCost}</td><td className="p-2">{b.warrantyMonths}</td><td className="p-2">{b.fittedOdometer}</td><td className="p-2">{b.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
