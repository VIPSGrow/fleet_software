import { z } from 'zod'

export const VehicleSchema = z.object({
  vehicleNo: z.string().min(3).max(50).regex(/^[A-Z0-9-]+$/),
  registrationDate: z.coerce.date().max(new Date()),
  makeModel: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  capacityTonnage: z.number().nonnegative().multipleOf(0.01),
  ownerType: z.enum(['OWNED', 'MARKET']),
  engineRef: z.string().max(100).optional().nullable(),
  chassisRef: z.string().max(100).optional().nullable(),
  currentOdometer: z.number().int().nonnegative(),
})

export const CreateVehicleSchema = VehicleSchema.omit({ currentOdometer: true })
export const UpdateVehicleSchema = VehicleSchema.partial()

export const DriverSchema = z.object({
  fullName: z.string().min(1).max(100),
  licenseNumber: z.string().min(1).max(50),
  licenseExpiry: z.coerce.date(),
  phone: z.string().max(20).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  baseSalary: z.number().nonnegative().default(0),
  aadharNumber: z.string().max(20).optional().nullable(),
})

export const CreateDriverSchema = DriverSchema
export const UpdateDriverSchema = DriverSchema.partial()

export const TripSchema = z.object({
  tripDate: z.coerce.date().max(new Date()),
  vehicleId: z.string(),
  driverId: z.string(),
  customerId: z.string().optional().nullable(),
  origin: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  totalKm: z.number().nonnegative().multipleOf(0.01),
  freightAmount: z.number().nonnegative().default(0),
  revenue: z.number().nonnegative().default(0),
  notes: z.string().max(1000).optional().nullable(),
})

export const CreateTripSchema = TripSchema
export const UpdateTripSchema = TripSchema.partial()

export const FuelEntrySchema = z.object({
  entryDate: z.coerce.date().max(new Date()),
  vehicleId: z.string(),
  station: z.string().min(1).max(200),
  fuelType: z.enum(['DIESEL', 'PETROL', 'CNG', 'ELECTRIC']),
  litres: z.number().positive().multipleOf(0.01),
  ratePerLitre: z.number().positive().multipleOf(0.01),
  totalAmount: z.number().nonnegative().optional(),
  odometerReading: z.number().int().nonnegative(),
})

export const CreateFuelEntrySchema = FuelEntrySchema
export const UpdateFuelEntrySchema = FuelEntrySchema.partial()

export const MaintenanceJobSchema = z.object({
  jobDate: z.coerce.date().max(new Date()),
  vehicleId: z.string(),
  odometerAtService: z.number().int().nonnegative(),
  jobType: z.enum(['PREVENTATIVE', 'BREAKDOWN']),
  workshopId: z.string().optional().nullable(),
  partsCost: z.number().nonnegative().default(0),
  labourCost: z.number().nonnegative().default(0),
  totalCost: z.number().nonnegative().optional(),
  description: z.string().max(1000).optional().nullable(),
})

export const CreateMaintenanceJobSchema = MaintenanceJobSchema
export const UpdateMaintenanceJobSchema = MaintenanceJobSchema.partial()

export const TyreSchema = z.object({
  vehicleId: z.string(),
  axlePosition: z.string().min(1).max(50),
  brand: z.string().min(1).max(100),
  size: z.string().min(1).max(50),
  purchaseDate: z.coerce.date().max(new Date()),
  purchaseCost: z.number().positive().multipleOf(0.01),
  fittedOdometer: z.number().int().nonnegative(),
  removalOdometer: z.number().int().nonnegative().optional().nullable(),
  status: z.enum(['FITTED', 'REMOVED', 'SCRAPPED']).default('FITTED'),
})

export const CreateTyreSchema = TyreSchema
export const UpdateTyreSchema = TyreSchema.partial()

export const DocumentSchema = z.object({
  documentType: z.enum([
    'INSURANCE',
    'FITNESS',
    'ROAD_TAX',
    'NATIONAL_PERMIT',
    'POLLUTION_CERTIFICATE',
    'DRIVER_LICENSE',
    'VEHICLE_REGISTRATION',
  ]),
  documentNumber: z.string().max(100).optional().nullable(),
  issueDate: z.coerce.date(),
  expiryDate: z.coerce.date(),
  renewalCost: z.number().nonnegative().default(0),
})

export const CreateDocumentSchema = DocumentSchema
export const UpdateDocumentSchema = DocumentSchema.partial()
