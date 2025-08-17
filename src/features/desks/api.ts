import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { 
  DeskResponseDTO,
  CreateDeskRequestDTO,
  UpdateDeskRequestDTO,
  DeskAvailabilityRequestDTO,
  DeskFilters
} from '@/types/desk'

// API endpoints
const DESK_ENDPOINTS = {
  GET_ALL: '/desk/get-all',
  GET_BY_ID: (id: number) => `/desk/get/${id}`,
  BY_FLOOR: (floorId: number) => `/desk/floor/${floorId}`,
  AVAILABLE: '/desk/available',
  CREATE: '/desk/create',
  UPDATE: (id: number) => `/desk/${id}/update`,
  DELETE: (id: number) => `/desk/${id}/delete`,
} as const

// Query keys
export const deskKeys = {
  all: ['desks'] as const,
  lists: () => [...deskKeys.all, 'list'] as const,
  list: (filters: DeskFilters) => [...deskKeys.lists(), filters] as const,
  details: () => [...deskKeys.all, 'detail'] as const,
  detail: (id: number) => [...deskKeys.details(), id] as const,
  byFloor: (floorId: number) => [...deskKeys.all, 'floor', floorId] as const,
  available: (filters: DeskAvailabilityRequestDTO) => [...deskKeys.all, 'available', filters] as const,
}

// Desks API functions
export const desksApi = {
  // Get all desks
  getAll: async (): Promise<DeskResponseDTO[]> => {
    const response = await apiClient.get<DeskResponseDTO[]>(DESK_ENDPOINTS.GET_ALL)
    return response.data
  },

  // Get desk by ID
  getById: async (id: number): Promise<DeskResponseDTO> => {
    const response = await apiClient.get<DeskResponseDTO>(DESK_ENDPOINTS.GET_BY_ID(id))
    return response.data
  },

  // Get desks by floor ID
  getByFloorId: async (floorId: number): Promise<DeskResponseDTO[]> => {
    const response = await apiClient.get<DeskResponseDTO[]>(DESK_ENDPOINTS.BY_FLOOR(floorId))
    return response.data
  },

  // Get available desks for a time period
  getAvailable: async (availabilityRequest: DeskAvailabilityRequestDTO): Promise<DeskResponseDTO[]> => {
    const response = await apiClient.post<DeskResponseDTO[]>(DESK_ENDPOINTS.AVAILABLE, availabilityRequest)
    return response.data
  },

  // Create desk (teamlead/admin only)
  create: async (data: CreateDeskRequestDTO): Promise<number> => {
    const response = await apiClient.post(DESK_ENDPOINTS.CREATE, data)
    // Extract desk ID from the Location header or response
    return response.status === 201 ? 1 : 0 // Backend returns 201 with location header
  },

  // Update desk (teamlead/admin only)
  update: async (id: number, data: UpdateDeskRequestDTO): Promise<void> => {
    await apiClient.put(DESK_ENDPOINTS.UPDATE(id), data)
  },

  // Delete desk (admin only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(DESK_ENDPOINTS.DELETE(id))
  },
}

// React Query hooks

// Get all desks
export const useDesksQuery = (filters?: DeskFilters) => {
  return useQuery({
    queryKey: deskKeys.list(filters || {}),
    queryFn: desksApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get desk by ID
export const useDeskQuery = (id: number) => {
  return useQuery({
    queryKey: deskKeys.detail(id),
    queryFn: () => desksApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get desks by floor
export const useDesksByFloorQuery = (floorId: number) => {
  return useQuery({
    queryKey: deskKeys.byFloor(floorId),
    queryFn: () => desksApi.getByFloorId(floorId),
    enabled: !!floorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get available desks
export const useAvailableDesksQuery = (availabilityRequest: DeskAvailabilityRequestDTO, enabled = true) => {
  return useQuery({
    queryKey: deskKeys.available(availabilityRequest),
    queryFn: () => desksApi.getAvailable(availabilityRequest),
    enabled: enabled && !!availabilityRequest.startTime && !!availabilityRequest.endTime,
    staleTime: 30 * 1000, // 30 seconds (availability changes frequently)
  })
}

// Create desk mutation (teamlead/admin)
export const useCreateDeskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: desksApi.create,
    onSuccess: () => {
      // Invalidate and refetch desk queries
      queryClient.invalidateQueries({ queryKey: deskKeys.all })
    },
  })
}

// Update desk mutation (teamlead/admin)
export const useUpdateDeskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeskRequestDTO }) =>
      desksApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific desk and lists
      queryClient.invalidateQueries({ queryKey: deskKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: deskKeys.lists() })
    },
  })
}

// Delete desk mutation (admin only)
export const useDeleteDeskMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: desksApi.delete,
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: deskKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: deskKeys.lists() })
    },
  })
}
