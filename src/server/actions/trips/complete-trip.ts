'use server'

import { revalidatePath } from 'next/cache'
import { updateTripStatus } from './update-trip-status'

export async function completeTrip(id: string) {
  const trip = await updateTripStatus(id, 'COMPLETED')
  revalidatePath('/trips')
  revalidatePath(`/trips/${id}`)
  return trip
}
