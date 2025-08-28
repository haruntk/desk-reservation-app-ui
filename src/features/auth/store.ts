import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearAuthData } from '@/lib/api'

import type { UserDTO, UserRole } from '@/types/auth'

interface AuthState {
  // Core auth state (no token needed for Windows Auth)
  user: UserDTO | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: UserDTO) => void
  logout: () => void
  setUser: (user: UserDTO) => void
  setLoading: (loading: boolean) => void
  
  // Computed getters
  getUserRoles: () => string[]
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
  isAdmin: () => boolean
  isTeamLead: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (user: UserDTO) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        clearAuthData()
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: UserDTO) => {
        set({ user })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      // Computed getters
      getUserRoles: () => {
        const { user } = get()
        return user?.roles || []
      },

      hasRole: (role: UserRole) => {
        const { user } = get()
        return user?.roles?.includes(role) || false
      },

      hasAnyRole: (roles: UserRole[]) => {
        const { user } = get()
        if (!user?.roles) return false
        return roles.some(role => user.roles.includes(role))
      },

      isAdmin: () => {
        const { user } = get()
        return user?.roles?.includes('Admin') || false
      },

      isTeamLead: () => {
        const { user } = get()
        return user?.roles?.includes('TeamLead') || false
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not loading states (no token for Windows Auth)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selectors for easier component usage
export const useAuth = () => {
  const store = useAuthStore()
  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    setUser: store.setUser,
    setLoading: store.setLoading,
  }
}

export const useAuthRoles = () => {
  const store = useAuthStore()
  return {
    getUserRoles: store.getUserRoles,
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,
    isAdmin: store.isAdmin,
    isTeamLead: store.isTeamLead,
  }
}
