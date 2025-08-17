// Authentication DTOs
export interface LoginRequestDTO {
  email: string
  password: string
}

export interface LoginResponseDTO {
  jwtToken: string
}

export interface RegisterRequestDTO {
  email: string
  password: string
}

export interface RegisterResponseDTO {
  email: string
}

// User DTOs
export interface UserDTO {
  id: string
  email: string
  userName: string
  roles: string[]
}

// Auth state types
export interface AuthState {
  user: UserDTO | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Role types
export type UserRole = 'User' | 'TeamLead' | 'Admin'

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequestDTO) => Promise<void>
  register: (userData: RegisterRequestDTO) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}
