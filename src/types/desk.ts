// Desk DTOs
export interface DeskResponseDTO {
  deskId: number
  deskName: string
  floorId: number
  floorNumber: string
  isAvailable: boolean
  nextReservationStart?: string
}

export interface CreateDeskRequestDTO {
  deskName: string
  floorId: number
}

export interface UpdateDeskRequestDTO {
  deskName: string
  floorId: number
}

export interface DeskAvailabilityRequestDTO {
  startTime: string
  endTime: string
}

// Additional desk types
export interface DeskDTO {
  deskId: number
  deskName: string
  floorId: number
}

// Desk query filters
export interface DeskFilters {
  floorId?: number
  isAvailable?: boolean
  startTime?: string
  endTime?: string
}
