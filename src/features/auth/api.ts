import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, clearAuthData } from '@/lib/api'

import type { 
  LoginRequestDTO, 
  LoginResponseDTO, 
  RegisterRequestDTO, 
  RegisterResponseDTO, 
  UserDTO 
} from '@/types/auth'

// API endpoints for Windows Authentication
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login', // Windows Auth login endpoint
  LOGOUT: '/auth/logout', // Windows Auth logout endpoint
  ME: '/user/me', // Get current user info
  GET_ALL_USERS: '/user/get-all',
  GET_USER_BY_ID: (id: string) => `/user/${id}`,
} as const

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  users: () => [...authKeys.all, 'users'] as const,
  user: (id: string) => [...authKeys.all, 'user', id] as const,
}

// Auth API functions for Windows Authentication
export const authApi = {
  // Windows Authentication login - typically a GET request to trigger auth
  login: async (): Promise<UserDTO> => {
    const response = await apiClient.get<UserDTO>(AUTH_ENDPOINTS.LOGIN)
    return response.data
  },

  // Logout user
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT)
    return response.data
  },

  // Get current user (if implemented in backend)
  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await apiClient.get<UserDTO>(AUTH_ENDPOINTS.ME)
    return response.data
  },

  // Get all users (admin/teamlead only)
  getAllUsers: async (): Promise<UserDTO[]> => {
    const response = await apiClient.get<UserDTO[]>(AUTH_ENDPOINTS.GET_ALL_USERS)
    return response.data
  },

  // Get user by ID (admin/teamlead only)
  getUserById: async (id: string): Promise<UserDTO> => {
    const response = await apiClient.get<UserDTO>(AUTH_ENDPOINTS.GET_USER_BY_ID(id))
    return response.data
  },
}

// React Query hooks
export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // Windows Authentication - just call the login endpoint
      const userData = await authApi.login()
      return userData
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

// Note: Registration might not be needed with Windows Authentication
// as users are typically managed through Active Directory

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear any localStorage auth data
      clearAuthData()
      queryClient.clear() // Clear all cached data
      
      // Redirect to login page
      window.location.href = '/login'
    },
  })
}

// Query for current user (Windows Authentication)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getCurrentUser,
    enabled: false, // Disabled - we'll use manual auth check instead
    retry: false, // Don't retry on 401
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Query for all users (admin/teamlead)
export const useUsersQuery = () => {
  return useQuery({
    queryKey: authKeys.users(),
    queryFn: authApi.getAllUsers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Query for specific user (admin/teamlead)
export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: authKeys.user(id),
    queryFn: () => authApi.getUserById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
