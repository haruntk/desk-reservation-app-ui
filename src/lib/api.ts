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

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7051/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
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
    
    // Handle 401 errors globally
    if (normalizedError.status === 401) {
      localStorage.removeItem('auth-token')
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

// Helper function to get auth token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth-token')
}

// Helper function to set auth token
export function setAuthToken(token: string): void {
  localStorage.setItem('auth-token', token)
}

// Helper function to clear auth token
export function clearAuthToken(): void {
  localStorage.removeItem('auth-token')
}
