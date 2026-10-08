export interface Trip {
  id: string
  tripDate: Date
  vehicleId: string
  driverId: string
  customerId?: string
  origin: string
  destination: string
  totalKm: number
  freightAmount: number
  revenue: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdById?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTripInput {
  tripDate: Date
  vehicleId: string
  driverId: string
  customerId?: string
  origin: string
  destination: string
  totalKm: number
  freightAmount?: number
  revenue?: number
  notes?: string
}

export interface UpdateTripInput extends Partial<CreateTripInput> {
  id: string
}

export interface TripWithRelations extends Trip {
  vehicle: {
    id: string
    vehicleNo: string
    makeModel: string
  }
  driver: {
    id: string
    fullName: string
  }
  customer?: {
    id: string
    name: string
  }
}
