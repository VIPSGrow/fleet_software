'use client'

import { useState } from 'react'
import { Tyre } from '@/types/tyre'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/server/utils/formatters'
import { Badge } from '@/components/ui/badge'
import { TyreForm } from './tyre-form'

interface TyreTableProps {
  tyres: Tyre[]
}

export function TyreTable({ tyres }: TyreTableProps) {
  const [editingTyre, setEditingTyre] = useState<Tyre | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FITTED':
        return <Badge variant="success">Fitted</Badge>
      case 'REMOVED':
        return <Badge variant="warning">Removed</Badge>
      case 'SCRAPPED':
        return <Badge variant="destructive">Scrapped</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left font-medium">Vehicle</th>
            <th className="p-3 text-left font-medium">Axle</th>
            <th className="p-3 text-left font-medium">Brand</th>
            <th className="p-3 text-left font-medium">Size</th>
            <th className="p-3 text-left font-medium">Purchase Date</th>
            <th className="p-3 text-right font-medium">Cost</th>
            <th className="p-3 text-center font-medium">Fitted KM</th>
            <th className="p-3 text-center font-medium">Removal KM</th>
            <th className="p-3 text-center font-medium">Status</th>
            <th className="p-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tyres.length === 0 ? (
            <tr>
              <td colSpan={10} className="p-6 text-center text-muted-foreground">
                No tyres found
              </td>
            </tr>
          ) : (
            tyres.map((tyre) => (
              <tr key={tyre.id} className="border-b hover:bg-muted/30">
                <td className="p-3">{tyre.vehicle?.vehicleNo || tyre.vehicleId} - {tyre.vehicle?.makeModel || ''}</td>
                <td className="p-3">{tyre.axlePosition}</td>
                <td className="p-3">{tyre.brand}</td>
                <td className="p-3">{tyre.size}</td>
                <td className="p-3">{formatDate(tyre.purchaseDate)}</td>
                <td className="p-3 text-right">{formatCurrency(tyre.purchaseCost)}</td>
                <td className="p-3 text-center">{tyre.fittedOdometer.toLocaleString()}</td>
                <td className="p-3 text-center">{tyre.removalOdometer?.toLocaleString() || '—'}</td>
                <td className="p-3 text-center">{getStatusBadge(tyre.status)}</td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    {tyre.status === 'FITTED' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTyre(tyre)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editingTyre && (
        <TyreForm
          tyre={editingTyre}
          onClose={() => setEditingTyre(null)}
          onSuccess={() => {
            setEditingTyre(null)
          }}
        />
      )}
    </div>
  )
}
