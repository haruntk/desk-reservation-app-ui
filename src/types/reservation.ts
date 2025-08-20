// Reservation status type
export type ReservationStatus = 'Active' | 'Scheduled' | 'Cancelled' | 'Completed'

// Reservation DTOs
export interface ReservationResponseDTO {
  reservationId: number
  userId: string
  deskId: number
  deskName: string
  floorNumber: number
  startTime: string
  endTime: string
  status: ReservationStatus
  createdAt: string
  duration: string
  isActive: boolean
  isPast: boolean
  isUpcoming: boolean
}

export interface CreateReservationRequestDTO {
  deskId: number
  startTime: string
  endTime: string
}

export interface UpdateReservationRequestDTO {
  deskId: number
  startTime: string
  endTime: string
}

export interface UpdateReservationStatusRequestDTO {
  status: ReservationStatus
}

// Additional reservation types
export interface ReservationDTO {
  reservationId: number
  userId: string
  deskId: number
  startTime: string
  endTime: string
  status: ReservationStatus
  createdAt: string
}

export interface UserReservationsResponseDTO {
  userId: string
  activeReservations: ReservationResponseDTO[]
  upcomingReservations: ReservationResponseDTO[]
  pastReservations: ReservationResponseDTO[]
  totalReservations: number
}

// Reservation query filters
export interface ReservationFilters {
  userId?: string
  deskId?: number
  status?: ReservationStatus
  startDate?: string
  endDate?: string
  isActive?: boolean
  isPast?: boolean
  isUpcoming?: boolean
}
