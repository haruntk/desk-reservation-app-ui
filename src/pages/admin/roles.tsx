import { useState } from "react"
import { Shield, Users } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRolesQuery, useCreateRoleMutation } from "@/features/roles/api"
import { useUsersQuery } from "@/features/auth/api"
import { createRoleRequestSchema, type CreateRoleRequestData } from "@/lib/schemas"

interface RoleWithStats {
  name: string
  userCount: number
  description: string
}

export function AdminRolesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { data: roles = [], isLoading: isLoadingRoles, refetch: refetchRoles } = useRolesQuery()
  const { data: users = [], isLoading: isLoadingUsers } = useUsersQuery()
  const createRoleMutation = useCreateRoleMutation()

  const form = useForm<CreateRoleRequestData>({
    resolver: zodResolver(createRoleRequestSchema),
    defaultValues: {
      name: "",
    },
  })

  // Create roles with user count statistics
  const rolesWithStats: RoleWithStats[] = roles.map((role) => {
    const userCount = users.filter(user => user.roles?.includes(role)).length
    const description = getRoleDescription(role)
    
    return {
      name: role,
      userCount,
      description,
    }
  })

  function getRoleDescription(role: string): string {
    switch (role) {
      case "Admin":
        return "Full system access with all permissions"
      case "TeamLead":
        return "Team management and reporting capabilities"
      case "User":
        return "Standard user with basic desk reservation access"
      default:
        return "Custom role with specific permissions"
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

  const onSubmit = async (data: CreateRoleRequestData) => {
    try {
      await createRoleMutation.mutateAsync(data)
      toast.success(`Role "${data.name}" created successfully!`)
      setShowCreateDialog(false)
      form.reset()
      refetchRoles()
    } catch (error) {
      toast.error(`Failed to create role "${data.name}"`)
      console.error("Create role error:", error)
    }
  }

  const handleCreateRole = () => {
    setShowCreateDialog(true)
  }

  const handleCloseDialog = () => {
    setShowCreateDialog(false)
    form.reset()
  }

  const columns: DataTableColumn<RoleWithStats>[] = [
    {
      key: "name",
      header: "Role Name",
      sortable: true,
      render: (role) => (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <Badge variant={getRoleBadgeVariant(role.name)} className="font-medium">
            {role.name}
          </Badge>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      sortable: false,
      render: (role) => (
        <span className="text-sm text-muted-foreground">{role.description}</span>
      ),
    },
    {
      key: "userCount",
      header: "Users",
      sortable: true,
      searchable: false,
      render: (role) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{role.userCount}</span>
          <span className="text-sm text-muted-foreground">
            user{role.userCount !== 1 ? 's' : ''}
          </span>
        </div>
      ),
    },
  ]

  const isLoading = isLoadingRoles || isLoadingUsers
  const isPending = createRoleMutation.isPending

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-muted-foreground">
          Manage system roles and their assignments to users.
        </p>
      </div>

      {/* Role Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              System roles available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Badge variant="destructive" className="h-4 w-4 p-0 text-xs">
              A
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.roles?.includes('Admin')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Admin users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <DataTable
        data={rolesWithStats}
        columns={columns}
        isLoading={isLoading}
        title="System Roles"
        searchPlaceholder="Search roles..."
        onAdd={handleCreateRole}
        addButtonText="Create New Role"
        itemsPerPage={10}
      />

      {/* Create Role Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Add a new role to the system. Users can then be assigned to this role.
            </DialogDescription>
          </DialogHeader>
          
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Manager, Supervisor, Guest"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
