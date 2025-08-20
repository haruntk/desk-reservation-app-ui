import { useState } from "react"
import { toast } from "sonner"
import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRolesQuery, useUserRolesQuery, useAssignRoleMutation, useRemoveRoleMutation } from "@/features/roles/api"
import type { UserDTO } from "@/types/auth"

interface UserRoleEditorProps {
  user: UserDTO
  onUserUpdate?: () => void
}

export function UserRoleEditor({ user, onUserUpdate }: UserRoleEditorProps) {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [roleToRemove, setRoleToRemove] = useState<string | null>(null)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  const { data: allRoles = [], isLoading: isLoadingRoles } = useRolesQuery()
  const { data: userRoles = [], isLoading: isLoadingUserRoles, refetch: refetchUserRoles } = useUserRolesQuery(user.id)
  const assignRoleMutation = useAssignRoleMutation()
  const removeRoleMutation = useRemoveRoleMutation()

  // Get roles that can be assigned (not already assigned to user)
  const availableRoles = allRoles.filter(role => !userRoles.includes(role))

  const handleAssignRole = async () => {
    if (!selectedRole) return

    try {
      await assignRoleMutation.mutateAsync({
        userId: user.id,
        roleName: selectedRole,
      })
      
      toast.success(`Role "${selectedRole}" assigned to ${user.email}`)
      setSelectedRole("")
      refetchUserRoles()
      onUserUpdate?.()
    } catch (error) {
      toast.error(`Failed to assign role "${selectedRole}"`)
      console.error("Assign role error:", error)
    }
  }

  const handleRemoveRole = (role: string) => {
    setRoleToRemove(role)
    setShowRemoveDialog(true)
  }

  const confirmRemoveRole = async () => {
    if (!roleToRemove) return

    try {
      await removeRoleMutation.mutateAsync({
        userId: user.id,
        roleName: roleToRemove,
      })
      
      toast.success(`Role "${roleToRemove}" removed from ${user.email}`)
      setShowRemoveDialog(false)
      setRoleToRemove(null)
      refetchUserRoles()
      onUserUpdate?.()
    } catch (error) {
      toast.error(`Failed to remove role "${roleToRemove}"`)
      console.error("Remove role error:", error)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive"
      case "TeamLead":
        return "default"
      case "User":
        return "secondary"
      default:
        return "outline"
    }
  }

  const isPending = assignRoleMutation.isPending || removeRoleMutation.isPending

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Management</CardTitle>
          <CardDescription>
            Manage roles for {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Roles */}
          <div>
            <h4 className="text-sm font-medium mb-2">Current Roles</h4>
            {isLoadingUserRoles ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16" />
                ))}
              </div>
            ) : userRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userRoles.map((role) => (
                  <Badge
                    key={role}
                    variant={getRoleBadgeVariant(role)}
                    className="flex items-center gap-1"
                  >
                    {role}
                    <button
                      onClick={() => handleRemoveRole(role)}
                      disabled={isPending}
                      className="ml-1 hover:bg-black/20 rounded-full p-0.5 transition-colors"
                      title={`Remove ${role} role`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No roles assigned</p>
            )}
          </div>

          {/* Assign New Role */}
          <div>
            <h4 className="text-sm font-medium mb-2">Assign New Role</h4>
            {isLoadingRoles ? (
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
            ) : availableRoles.length > 0 ? (
              <div className="flex gap-2">
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  disabled={isPending}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                            {role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAssignRole}
                  disabled={!selectedRole || isPending}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assign
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All available roles are already assigned to this user
              </p>
            )}
          </div>

          {/* User Info Summary */}
          <div className="pt-4 border-t">
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>User ID:</strong> {user.id}</div>
              <div><strong>Username:</strong> {user.userName}</div>
              <div><strong>Email:</strong> {user.email}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remove Role Confirmation Dialog */}
      <ConfirmDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        title="Remove Role"
        description={`Are you sure you want to remove the "${roleToRemove}" role from ${user.email}? This action cannot be undone.`}
        confirmText="Remove Role"
        cancelText="Cancel"
        onConfirm={confirmRemoveRole}
        isLoading={removeRoleMutation.isPending}
      />
    </>
  )
}
