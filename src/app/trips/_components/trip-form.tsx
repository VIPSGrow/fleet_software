'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreateTripSchema } from '@/server/utils/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'

interface TripFormProps {
  trip?: any
  onClose: () => void
  onSuccess: () => void
}

export function TripForm({ trip, onClose, onSuccess }: TripFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(trip ? CreateTripSchema.omit({ tripDate: true }).partial() : CreateTripSchema),
    defaultValues: trip
      ? {
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
          origin: trip.origin,
          destination: trip.destination,
          totalKm: trip.totalKm,
          revenue: trip.revenue,
        }
      : {
          tripDate: new Date(),
          vehicleId: '',
          driverId: '',
          origin: '',
          destination: '',
          totalKm: 0,
          revenue: 0,
        },
  })

  useEffect(() => {
    if (trip) {
      reset({
        vehicleId: trip.vehicleId,
        driverId: trip.driverId,
        origin: trip.origin,
        destination: trip.destination,
        totalKm: trip.totalKm,
        revenue: trip.revenue,
      })
    }
  }, [trip, reset])

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        tripDate: trip ? trip.tripDate : data.tripDate || new Date(),
        totalKm: Number(data.totalKm),
        revenue: Number(data.revenue),
      }

      const res = await fetch(trip ? '/api/trips' : '/api/trips', {
        method: trip ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip ? { id: trip.id, ...payload } : payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save trip')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!trip} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{trip ? 'Edit Trip' : 'New Trip'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input
                id="vehicleId"
                {...register('vehicleId')}
                disabled={loading}
              />
              {errors.vehicleId && (
                <p className="text-sm text-destructive">{errors.vehicleId.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverId">Driver ID</Label>
              <Input
                id="driverId"
                {...register('driverId')}
                disabled={loading}
              />
              {errors.driverId && (
                <p className="text-sm text-destructive">{errors.driverId.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                {...register('origin')}
                disabled={loading}
              />
              {errors.origin && (
                <p className="text-sm text-destructive">{errors.origin.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                {...register('destination')}
                disabled={loading}
              />
              {errors.destination && (
                <p className="text-sm text-destructive">{errors.destination.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalKm">Total KM</Label>
              <Input
                id="totalKm"
                type="number"
                step="0.01"
                {...register('totalKm', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.totalKm && (
                <p className="text-sm text-destructive">{errors.totalKm.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="revenue">Revenue (INR)</Label>
              <Input
                id="revenue"
                type="number"
                step="0.01"
                {...register('revenue', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.revenue && (
                <p className="text-sm text-destructive">{errors.revenue.message as string}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : trip ? 'Update Trip' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
