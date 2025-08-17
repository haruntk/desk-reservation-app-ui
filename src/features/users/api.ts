import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

import type { UserDTO } from '@/types/auth'

// API endpoints
const USER_ENDPOINTS = {
  GET_ALL: '/user/get-all',
  GET_BY_ID: (id: string) => `/user/${id}`,
} as const

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Users API functions
export const usersApi = {
  // Get all users (admin/teamlead only)
  getAll: async (): Promise<UserDTO[]> => {
    const response = await apiClient.get<UserDTO[]>(USER_ENDPOINTS.GET_ALL)
    return response.data
  },

  // Get user by ID (admin/teamlead only)
  getById: async (id: string): Promise<UserDTO> => {
    const response = await apiClient.get<UserDTO>(USER_ENDPOINTS.GET_BY_ID(id))
    return response.data
  },
}

// React Query hooks

// Get all users (admin/teamlead)
export const useUsersQuery = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: usersApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get user by ID (admin/teamlead)
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
