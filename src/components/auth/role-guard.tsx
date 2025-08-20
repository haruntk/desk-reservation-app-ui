import { Navigate } from 'react-router-dom'
import { useAuthRoles } from '@/features/auth/store'

import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
  children: React.ReactNode
  roles: UserRole[]
  fallback?: React.ReactNode
  requireAll?: boolean // If true, user must have ALL roles; if false, user needs ANY role
}

export function RoleGuard({ 
  children, 
  roles, 
  fallback,
  requireAll = false 
}: RoleGuardProps) {
  const { hasRole, hasAnyRole } = useAuthRoles()

  const hasAccess = requireAll 
    ? roles.every(role => hasRole(role))
    : hasAnyRole(roles)

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}

// Convenience components for common role checks
export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RoleGuard roles={['Admin']} fallback={fallback}>{children}</RoleGuard>
}

export function TeamLeadOrAdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <RoleGuard roles={['TeamLead', 'Admin']} fallback={fallback}>{children}</RoleGuard>
}
