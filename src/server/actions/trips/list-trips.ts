'use server'

import prisma from '@/lib/prisma'

export async function listTrips(filters: {
  page?: number
  limit?: number
  vehicleId?: string
  driverId?: string
  status?: string
  startDate?: string
  endDate?: string
}) {
  const { page = 1, limit = 20, vehicleId, driverId, status, startDate, endDate } = filters

  const where: any = {}

  if (vehicleId) where.vehicleId = vehicleId
  if (driverId) where.driverId = driverId
  if (status) where.status = status

  if (startDate || endDate) {
    where.tripDate = {}
    if (startDate) where.tripDate.gte = new Date(startDate)
    if (endDate) where.tripDate.lte = new Date(endDate)
  }

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { tripDate: 'desc' },
      include: {
        vehicle: true,
        driver: true,
        customer: true,
      },
    }),
    prisma.trip.count({ where }),
  ])

  return {
    trips,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
