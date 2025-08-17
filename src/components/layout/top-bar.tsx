import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/features/auth/store'
import { useLogoutMutation } from '@/features/auth'
import toast from 'react-hot-toast'

export function TopBar() {
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    logoutMutation.mutate()
    toast.success('Logged out successfully')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Desk Reservation</h1>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {/* User menu */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {user?.email || 'User'}
            </span>
            {user?.roles && user.roles.length > 0 && (
              <span className="hidden sm:inline-block text-xs text-muted-foreground">
                ({user.roles.join(', ')})
              </span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
