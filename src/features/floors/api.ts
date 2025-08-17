import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

import type { 
  FloorResponseDTO,
  CreateFloorRequestDTO,
  UpdateFloorRequestDTO,
  FloorFilters
} from '@/types/floor'

// API endpoints
const FLOOR_ENDPOINTS = {
  GET_ALL: '/floor/get-all',
  GET_BY_ID: (id: number) => `/floor/get/${id}`,
  CREATE: '/floor/create',
  UPDATE: (id: number) => `/floor/${id}/update`,
  DELETE: (id: number) => `/floor/${id}/delete`,
} as const

// Query keys
export const floorKeys = {
  all: ['floors'] as const,
  lists: () => [...floorKeys.all, 'list'] as const,
  list: (filters: FloorFilters) => [...floorKeys.lists(), filters] as const,
  details: () => [...floorKeys.all, 'detail'] as const,
  detail: (id: number) => [...floorKeys.details(), id] as const,
}

// Floors API functions
export const floorsApi = {
  // Get all floors
  getAll: async (): Promise<FloorResponseDTO[]> => {
    const response = await apiClient.get<FloorResponseDTO[]>(FLOOR_ENDPOINTS.GET_ALL)
    return response.data
  },

  // Get floor by ID
  getById: async (id: number): Promise<FloorResponseDTO> => {
    const response = await apiClient.get<FloorResponseDTO>(FLOOR_ENDPOINTS.GET_BY_ID(id))
    return response.data
  },

  // Create floor (teamlead/admin only)
  create: async (data: CreateFloorRequestDTO): Promise<number> => {
    const response = await apiClient.post(FLOOR_ENDPOINTS.CREATE, data)
    // Extract floor ID from the Location header or response
    return response.status === 201 ? 1 : 0 // Backend returns 201 with location header
  },

  // Update floor (teamlead/admin only)
  update: async (id: number, data: UpdateFloorRequestDTO): Promise<void> => {
    await apiClient.put(FLOOR_ENDPOINTS.UPDATE(id), data)
  },

  // Delete floor (admin only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(FLOOR_ENDPOINTS.DELETE(id))
  },
}

// React Query hooks

// Get all floors
export const useFloorsQuery = (filters?: FloorFilters) => {
  return useQuery({
    queryKey: floorKeys.list(filters || {}),
    queryFn: floorsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes (floors don't change often)
  })
}

// Get floor by ID
export const useFloorQuery = (id: number) => {
  return useQuery({
    queryKey: floorKeys.detail(id),
    queryFn: () => floorsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create floor mutation (teamlead/admin)
export const useCreateFloorMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: floorsApi.create,
    onSuccess: () => {
      // Invalidate and refetch floor queries
      queryClient.invalidateQueries({ queryKey: floorKeys.all })
    },
  })
}

// Update floor mutation (teamlead/admin)
export const useUpdateFloorMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFloorRequestDTO }) =>
      floorsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific floor and lists
      queryClient.invalidateQueries({ queryKey: floorKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: floorKeys.lists() })
    },
  })
}

// Delete floor mutation (admin only)
export const useDeleteFloorMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: floorsApi.delete,
    onSuccess: (_, id) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: floorKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: floorKeys.lists() })
      
      // Also invalidate desk queries since they depend on floors
      queryClient.invalidateQueries({ queryKey: ['desks'] })
    },
  })
}
