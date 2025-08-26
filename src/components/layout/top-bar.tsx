import { useState } from 'react'
import { LogOut, User, ChevronDown, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/features/auth/store'
import { useLogoutMutation } from '@/features/auth'
import { toast } from 'sonner'

export function TopBar() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      // useLogoutMutation onSettled callback handles:
      // - clearAuthToken()
      // - queryClient.clear()
      // - localStorage.removeItem('auth-storage')
      // - window.location.href = '/login'
    } catch (error) {
      toast.error('Logout failed. Please try again.')
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

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm"
      >
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <Monitor className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              DeskSpace
            </span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <ThemeToggle variant="compact" />
            
            {/* User menu */}
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 px-3"
                  aria-label={`User menu for ${user?.email || 'current user'}`}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline-block text-sm">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.email || 'User'}</p>
                <p className="text-xs text-muted-foreground">ID: {user?.id || 'Unknown'}</p>
              </div>
              
              {user?.roles && user.roles.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5">
                    <p className="text-xs font-medium mb-2">Roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge 
                          key={role} 
                          variant={getRoleBadgeVariant(role)} 
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => setShowLogoutDialog(true)}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        isLoading={logoutMutation.isPending}
      />
    </>
  )
}
