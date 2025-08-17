import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, setAuthToken, clearAuthToken } from '@/lib/api'

import type { 
  LoginRequestDTO, 
  LoginResponseDTO, 
  RegisterRequestDTO, 
  RegisterResponseDTO, 
  UserDTO 
} from '@/types/auth'

// API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  LOGOUT: '/user/logout',
  ME: '/user/me', // This might need to be implemented in the backend
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

// Auth API functions
export const authApi = {
  // Login user
  login: async (credentials: LoginRequestDTO): Promise<LoginResponseDTO> => {
    const response = await apiClient.post<LoginResponseDTO>(AUTH_ENDPOINTS.LOGIN, credentials)
    return response.data
  },

  // Register user
  register: async (userData: RegisterRequestDTO): Promise<RegisterResponseDTO> => {
    const response = await apiClient.post<RegisterResponseDTO>(AUTH_ENDPOINTS.REGISTER, userData)
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
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store the token
      setAuthToken(data.jwtToken)
      
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
    onError: () => {
      // Clear any existing token on login error
      clearAuthToken()
    },
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApi.register,
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear token and user data
      clearAuthToken()
      queryClient.clear() // Clear all cached data
      
      // Redirect to login page
      window.location.href = '/login'
    },
  })
}

// Query for current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem('auth-token'), // Only fetch if token exists
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
