import axios from 'axios'

import type { AxiosError, AxiosResponse } from 'axios'

// API Error types
export interface ApiError {
  message: string
  status: number
  code?: string
}

// Backend error response structure
interface BackendErrorResponse {
  error?: string
  message?: string
  code?: string
}

export interface ApiResponse<T = unknown> {
  data: T
  success: boolean
  message?: string
}

// Create axios instance for Windows Authentication
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7051/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Send cookies with requests for Windows Auth
})

// Request interceptor for Windows Authentication
apiClient.interceptors.request.use(
  (config) => {
    // Windows Authentication uses cookies automatically
    // No need to add Authorization header
    return config
  },
  (error) => {
    return Promise.reject(normalizeError(error))
  }
)

// Response interceptor to handle errors and normalize responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // For successful responses, return the data directly
    return response
  },
  (error: AxiosError) => {
    const normalizedError = normalizeError(error)
    
    // Handle 401 errors globally for Windows Auth
    if (normalizedError.status === 401) {
      // For Windows Auth, redirect to login or show auth dialog
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(normalizedError)
  }
)

// Error normalization function
export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BackendErrorResponse>
    
    if (axiosError.response) {
      // Server responded with error status
      const { status, data } = axiosError.response
      return {
        message: data?.error || data?.message || `HTTP ${status} Error`,
        status,
        code: data?.code,
      }
    } else if (axiosError.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
      }
    } else {
      // Something else happened
      return {
        message: axiosError.message || 'An unexpected error occurred',
        status: 0,
        code: 'UNKNOWN_ERROR',
      }
    }
  }
  
  // Non-axios error - check if it has a message property
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      message: String(error.message) || 'An unexpected error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    status: 0,
    code: 'UNKNOWN_ERROR',
  }
}

// Helper functions for Windows Authentication
// Note: Windows Auth uses HTTP-only cookies, so no token management needed

// Clear any remaining localStorage data (legacy cleanup)
export function clearAuthData(): void {
  localStorage.removeItem('auth-token')
  localStorage.removeItem('auth-storage')
}

// Check if user is authenticated (will be handled by API calls)
export function checkAuthentication(): Promise<boolean> {
  // This will be implemented based on backend /me endpoint
  return apiClient.get('/user/me')
    .then(() => true)
    .catch(() => false)
}
