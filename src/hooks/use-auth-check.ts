import { useEffect } from 'react'
import { useAuth } from '@/features/auth/store'
import { authApi } from '@/features/auth'

/**
 * Hook to automatically check and establish Windows Authentication
 * Attempts to authenticate user automatically on app startup
 */
export function useAuthCheck() {
  const { user, isAuthenticated, login, setLoading } = useAuth()

  useEffect(() => {
    // Only try auto-auth if user is not already authenticated
    if (!isAuthenticated && !user) {
      setLoading(true)
      
      // Attempt automatic Windows Authentication
      authApi.getCurrentUser()
        .then((userData) => {
          // Successful auto-authentication
          login(userData)
          console.log('Auto Windows Authentication successful:', userData.userName)
        })
        .catch((error) => {
          // Auto-auth failed - user needs to manually authenticate
          console.log('Auto Windows Authentication failed:', error.message || 'Unknown error')
          // Don't set error state, just let user manually authenticate
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isAuthenticated, user, login, setLoading])

  return {
    isLoading: false, // We handle loading internally
    isAuthenticated,
    user
  }
}
