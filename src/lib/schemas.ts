import { z } from 'zod'

// Authentication Schemas
export const loginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginResponseSchema = z.object({
  jwtToken: z.string(),
})

export const registerResponseSchema = z.object({
  email: z.string().email(),
})

// User Schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  userName: z.string(),
  roles: z.array(z.string()),
})

// Desk Schemas
export const createDeskRequestSchema = z.object({
  deskName: z.string()
    .min(1, 'Desk name is required')
    .max(50, 'Desk name must be 50 characters or less'),
  floorId: z.number()
    .int('Floor ID must be an integer')
    .positive('Floor ID must be positive'),
})

export const updateDeskRequestSchema = z.object({
  deskName: z.string()
    .min(1, 'Desk name is required')
    .max(50, 'Desk name must be 50 characters or less'),
  floorId: z.number()
    .int('Floor ID must be an integer')
    .positive('Floor ID must be positive'),
})

export const deskAvailabilityRequestSchema = z.object({
  StartTime: z.string().datetime('Invalid start time format'),
  EndTime: z.string().datetime('Invalid end time format'),
}).refine(
  (data) => new Date(data.StartTime) < new Date(data.EndTime),
  {
    message: 'End time must be after start time',
    path: ['EndTime'],
  }
)

export const deskResponseSchema = z.object({
  deskId: z.number(),
  deskName: z.string(),
  floorId: z.number(),
  floorNumber: z.string(),
  isAvailable: z.boolean(),
  nextReservationStart: z.string().optional(),
})

// Reservation Schemas
export const reservationStatusSchema = z.enum(['Active', 'Scheduled', 'Cancelled', 'Completed'])

export const createReservationRequestSchema = z.object({
  deskId: z.number()
    .int('Desk ID must be an integer')
    .positive('Desk ID must be positive'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
}).refine(
  (data) => {
    const start = new Date(data.startTime)
    const end = new Date(data.endTime)
    const now = new Date()
    
    // End time must be after start time
    if (end <= start) return false
    
    // Start time cannot be in the past (with 5 minute tolerance)
    if (start < new Date(now.getTime() - 5 * 60 * 1000)) return false
    
    return true
  },
  {
    message: 'Invalid reservation time range',
  }
)

export const updateReservationRequestSchema = z.object({
  deskId: z.number()
    .int('Desk ID must be an integer')
    .positive('Desk ID must be positive'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
}).refine(
  (data) => new Date(data.startTime) < new Date(data.endTime),
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
)

export const updateReservationStatusRequestSchema = z.object({
  status: reservationStatusSchema,
})

export const reservationResponseSchema = z.object({
  reservationId: z.number(),
  userId: z.string(),
  deskId: z.number(),
  deskName: z.string(),
  floorNumber: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  status: reservationStatusSchema,
  createdAt: z.string(),
  duration: z.string(),
  isActive: z.boolean(),
  isPast: z.boolean(),
  isUpcoming: z.boolean(),
})

// Floor Schemas
export const createFloorRequestSchema = z.object({
  floorNumber: z.number()
    .int('Floor number must be an integer')
    .positive('Floor number must be positive'),
})

export const updateFloorRequestSchema = z.object({
  floorNumber: z.number()
    .int('Floor number must be an integer')
    .positive('Floor number must be positive'),
})

export const floorResponseSchema = z.object({
  floorId: z.number(),
  floorNumber: z.number(),
  deskCount: z.number(),
  createdAt: z.string(),
})

// Role Schemas
export const assignRoleRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  roleName: z.string().min(1, 'Role name is required'),
})

export const createRoleRequestSchema = z.object({
  name: z.string()
    .min(1, 'Role name is required')
    .max(50, 'Role name must be 50 characters or less'),
})

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  normalizedName: z.string(),
})

// Type inference helpers
export type LoginRequestData = z.infer<typeof loginRequestSchema>
export type RegisterRequestData = z.infer<typeof registerRequestSchema>
export type CreateDeskRequestData = z.infer<typeof createDeskRequestSchema>
export type UpdateDeskRequestData = z.infer<typeof updateDeskRequestSchema>
export type CreateReservationRequestData = z.infer<typeof createReservationRequestSchema>
export type UpdateReservationRequestData = z.infer<typeof updateReservationRequestSchema>
export type CreateFloorRequestData = z.infer<typeof createFloorRequestSchema>
export type UpdateFloorRequestData = z.infer<typeof updateFloorRequestSchema>
export type AssignRoleRequestData = z.infer<typeof assignRoleRequestSchema>
export type CreateRoleRequestData = z.infer<typeof createRoleRequestSchema>
