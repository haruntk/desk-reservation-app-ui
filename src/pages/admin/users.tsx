import { useState } from "react"
import { Users, Settings, Mail } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserRoleEditor } from "@/components/admin/user-role-editor"
import { useUsersQuery } from "@/features/auth/api"
import type { UserDTO } from "@/types/auth"

export function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null)
  const [showRoleEditor, setShowRoleEditor] = useState(false)

  const { data: users = [], isLoading, refetch } = useUsersQuery()

  const handleManageRoles = (user: UserDTO) => {
    setSelectedUser(user)
    setShowRoleEditor(true)
  }

  const handleUserUpdate = () => {
    refetch() // Refresh the users list to show updated roles
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

  const columns: DataTableColumn<UserDTO>[] = [
    {
      key: "email",
      header: "Email",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{user.email}</span>
        </div>
      ),
    },
    {
      key: "userName",
      header: "Username",
      sortable: true,
    },
    {
      key: "id",
      header: "User ID",
      sortable: true,
      render: (user) => (
        <span className="font-mono text-sm text-muted-foreground">
          {user.id.length > 8 ? `${user.id.slice(0, 8)}...` : user.id}
        </span>
      ),
    },
    {
      key: "roles",
      header: "Roles",
      sortable: false,
      searchable: false,
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No roles</span>
          )}
        </div>
      ),
    },
  ]

  const renderActions = (user: UserDTO) => (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleManageRoles(user)}
      >
        <Settings className="h-4 w-4 mr-1" />
        Manage Roles
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and role assignments.
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        title="All Users"
        searchPlaceholder="Search users by email or username..."
        actions={renderActions}
        itemsPerPage={15}
      />

      {/* Role Management Dialog */}
      <Dialog open={showRoleEditor} onOpenChange={setShowRoleEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Role Management
            </DialogTitle>
            <DialogDescription>
              Assign or remove roles for the selected user. Changes take effect immediately.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <UserRoleEditor
              user={selectedUser}
              onUserUpdate={handleUserUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
