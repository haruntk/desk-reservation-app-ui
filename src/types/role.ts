// Role DTOs
export interface AssignRoleRequestDTO {
  userId: string
  roleName: string
}

export interface AssignRoleResponseDTO {
  success: boolean
  message?: string
}

export interface CreateRoleRequestDTO {
  name: string
}

// Additional role types
export interface RoleDTO {
  id: string
  name: string
  normalizedName: string
}

export interface UserRoleDTO {
  userId: string
  roleName: string
  assignedAt?: string
}
