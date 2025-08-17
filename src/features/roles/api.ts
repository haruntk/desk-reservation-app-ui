import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { 
  AssignRoleRequestDTO,
  AssignRoleResponseDTO,
  CreateRoleRequestDTO
} from '@/types/role'

// API endpoints
const ROLE_ENDPOINTS = {
  ASSIGN: '/role/assign-role',
  REMOVE: '/role/remove-role',
  USER_ROLES: (userId: string) => `/role/user-roles/${userId}`,
  ALL_ROLES: '/role/all-roles',
  CREATE: '/role/create-role',
} as const

// Query keys
export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  userRoles: (userId: string) => [...roleKeys.all, 'user', userId] as const,
}

// Roles API functions
export const rolesApi = {
  // Assign role to user (admin only)
  assignRole: async (data: AssignRoleRequestDTO): Promise<AssignRoleResponseDTO> => {
    const response = await apiClient.post<AssignRoleResponseDTO>(ROLE_ENDPOINTS.ASSIGN, data)
    return response.data
  },

  // Remove role from user (admin only)
  removeRole: async (data: AssignRoleRequestDTO): Promise<AssignRoleResponseDTO> => {
    const response = await apiClient.delete<AssignRoleResponseDTO>(ROLE_ENDPOINTS.REMOVE, { data })
    return response.data
  },

  // Get user's roles (admin only)
  getUserRoles: async (userId: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(ROLE_ENDPOINTS.USER_ROLES(userId))
    return response.data
  },

  // Get all roles (admin only)
  getAllRoles: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>(ROLE_ENDPOINTS.ALL_ROLES)
    return response.data
  },

  // Create role (admin only)
  createRole: async (data: CreateRoleRequestDTO): Promise<void> => {
    await apiClient.post(ROLE_ENDPOINTS.CREATE, data)
  },
}

// React Query hooks

// Get all roles (admin)
export const useRolesQuery = () => {
  return useQuery({
    queryKey: roleKeys.lists(),
    queryFn: rolesApi.getAllRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes (roles don't change often)
  })
}

// Get user roles (admin)
export const useUserRolesQuery = (userId: string) => {
  return useQuery({
    queryKey: roleKeys.userRoles(userId),
    queryFn: () => rolesApi.getUserRoles(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Assign role mutation (admin)
export const useAssignRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rolesApi.assignRole,
    onSuccess: (_, variables) => {
      // Invalidate user roles and user lists
      queryClient.invalidateQueries({ queryKey: roleKeys.userRoles(variables.userId) })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Remove role mutation (admin)
export const useRemoveRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rolesApi.removeRole,
    onSuccess: (_, variables) => {
      // Invalidate user roles and user lists
      queryClient.invalidateQueries({ queryKey: roleKeys.userRoles(variables.userId) })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// Create role mutation (admin)
export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rolesApi.createRole,
    onSuccess: () => {
      // Invalidate roles list
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() })
    },
  })
}
