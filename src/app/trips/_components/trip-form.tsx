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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { createTrip, updateTrip, updateTripStatus } from '@/server/actions/trips'
import { listVehiclesAction } from '@/server/actions/vehicles'
import { listDriversAction } from '@/server/actions/drivers'

interface TripFormProps {
  trip?: any
  onClose: () => void
  onSuccess: () => void
}

export function TripForm({ trip, onClose, onSuccess }: TripFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [vehicles, setVehicles] = useState<{ id: string; vehicleNo: string; makeModel: string; status: string }[]>([])
  const [drivers, setDrivers] = useState<{ id: string; fullName: string; licenseNumber: string; status: string }[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          listVehiclesAction(1, 100, undefined, undefined, 'ACTIVE'),
          listDriversAction(1, 100, undefined, 'ACTIVE'),
        ])
        if (vehiclesRes.success) {
          setVehicles(vehiclesRes.vehicles || [])
        }
        if (driversRes.success) {
          setDrivers(driversRes.drivers || [])
        }
      } catch (err) {
        console.error('Failed to fetch options:', err)
      }
    }
    fetchOptions()
  }, [])

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

      let result
      if (trip) {
        result = await updateTrip(trip.id, payload)
      } else {
        result = await createTrip(payload)
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to save trip')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleId">Vehicle ID</Label>
          <Select
            value={watch('vehicleId')}
            onValueChange={(value) => {
              setValue('vehicleId', value, { shouldValidate: true })
            }}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.vehicleNo} - {vehicle.makeModel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vehicleId && (
            <p className="text-sm text-destructive">{errors.vehicleId.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="driverId">Driver ID</Label>
          <Select
            value={watch('driverId')}
            onValueChange={(value) => {
              setValue('driverId', value, { shouldValidate: true })
            }}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select driver" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.fullName} ({driver.licenseNumber})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
  )

  if (trip) {
    return (
      <Dialog open={!!trip} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return formContent
}