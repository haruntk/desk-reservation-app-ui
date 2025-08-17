// Floor DTOs
export interface FloorResponseDTO {
  floorId: number
  floorNumber: number
  deskCount: number
  createdAt: string
}

export interface CreateFloorRequestDTO {
  floorNumber: number
}

export interface UpdateFloorRequestDTO {
  floorNumber: number
}

// Additional floor types
export interface FloorDTO {
  floorId: number
  floorNumber: number
}

// Floor query filters
export interface FloorFilters {
  floorNumber?: number
  hasDesks?: boolean
}
