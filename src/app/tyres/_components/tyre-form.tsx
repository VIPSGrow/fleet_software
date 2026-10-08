'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreateTyreSchema } from '@/server/utils/validators'
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

interface TyreFormProps {
  tyre?: any
  onClose: () => void
  onSuccess: () => void
}

export function TyreForm({ tyre, onClose, onSuccess }: TyreFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(tyre ? CreateTyreSchema.partial() : CreateTyreSchema),
    defaultValues: tyre
      ? {
          vehicleId: tyre.vehicleId,
          axlePosition: tyre.axlePosition,
          brand: tyre.brand,
          size: tyre.size,
          purchaseDate: format(new Date(tyre.purchaseDate), 'yyyy-MM-dd'),
          purchaseCost: tyre.purchaseCost,
          fittedOdometer: tyre.fittedOdometer,
        }
      : {
          vehicleId: '',
          axlePosition: '',
          brand: '',
          size: '',
          purchaseDate: format(new Date(), 'yyyy-MM-dd'),
          purchaseCost: 0,
          fittedOdometer: 0,
        },
  })

  useEffect(() => {
    if (tyre) {
      reset({
        vehicleId: tyre.vehicleId,
        axlePosition: tyre.axlePosition,
        brand: tyre.brand,
        size: tyre.size,
        purchaseDate: format(new Date(tyre.purchaseDate), 'yyyy-MM-dd'),
        purchaseCost: tyre.purchaseCost,
        fittedOdometer: tyre.fittedOdometer,
      })
    }
  }, [tyre, reset])

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        purchaseCost: Number(data.purchaseCost),
        fittedOdometer: Number(data.fittedOdometer),
      }

      const res = await fetch(tyre ? '/api/tyres' : '/api/tyres', {
        method: tyre ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tyre ? { id: tyre.id, ...payload } : payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save tyre')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!tyre || !tyre} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tyre ? 'Edit Tyre' : 'Fit New Tyre'}</DialogTitle>
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
              <Label htmlFor="axlePosition">Axle Position</Label>
              <Input
                id="axlePosition"
                {...register('axlePosition')}
                disabled={loading}
              />
              {errors.axlePosition && (
                <p className="text-sm text-destructive">{errors.axlePosition.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                {...register('brand')}
                disabled={loading}
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                {...register('size')}
                disabled={loading}
              />
              {errors.size && (
                <p className="text-sm text-destructive">{errors.size.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate')}
                disabled={loading}
              />
              {errors.purchaseDate && (
                <p className="text-sm text-destructive">{errors.purchaseDate.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseCost">Purchase Cost (INR)</Label>
              <Input
                id="purchaseCost"
                type="number"
                step="0.01"
                {...register('purchaseCost', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.purchaseCost && (
                <p className="text-sm text-destructive">{errors.purchaseCost.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fittedOdometer">Fitted Odometer</Label>
              <Input
                id="fittedOdometer"
                type="number"
                {...register('fittedOdometer', { valueAsNumber: true })}
                disabled={loading}
              />
              {errors.fittedOdometer && (
                <p className="text-sm text-destructive">{errors.fittedOdometer.message as string}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : tyre ? 'Update Tyre' : 'Fit Tyre'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
