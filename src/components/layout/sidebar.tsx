import { Link, useLocation } from 'react-router-dom'
import { 
  Monitor, 
  Building2, 
  Shield, 
  LayoutDashboard,
  CalendarCheck,
  Settings,
  UserCog
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthRoles } from '@/features/auth/store'

const navigation = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: LayoutDashboard,
    roles: [] // Available to all authenticated users
  },
  {
    name: 'My Reservations',
    href: '/app/reservations',
    icon: CalendarCheck,
    roles: []
  },
  {
    name: 'Desks',
    href: '/app/desks',
    icon: Monitor,
    roles: []
  },
  {
    name: 'Floors',
    href: '/app/floors',
    icon: Building2,
    roles: [] // Available to all users
  },

]

const adminNavigation = [
  {
    name: 'Desks',
    href: '/app/admin/desks',
    icon: Monitor,
    roles: ['Admin']
  },
  {
    name: 'Floors',
    href: '/app/admin/floors',
    icon: Building2,
    roles: ['Admin']
  },
  {
    name: 'Users',
    href: '/app/admin/users',
    icon: UserCog,
    roles: ['Admin']
  },
  {
    name: 'Roles',
    href: '/app/admin/roles',
    icon: Shield,
    roles: ['Admin']
  },
]

export function Sidebar() {
  const location = useLocation()
  const { hasAnyRole } = useAuthRoles()

  const filteredNavigation = navigation.filter(item => {
    if (item.roles.length === 0) return true
    return hasAnyRole(item.roles as ('User' | 'TeamLead' | 'Admin')[])
  })

  const filteredAdminNavigation = adminNavigation.filter(item => {
    return hasAnyRole(item.roles as ('User' | 'TeamLead' | 'Admin')[])
  })

  const showAdminSection = filteredAdminNavigation.length > 0

  return (
    <aside className="w-64 bg-card border-r border-border">
      {/* App Logo/Name */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <Monitor className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">DeskSpace</h1>
          <p className="text-xs text-muted-foreground">Reservation System</p>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}

        {/* Admin Section */}
        {showAdminSection && (
          <>
            <div className="pt-4 pb-2">
              <div className="flex items-center space-x-2 px-3 py-1">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Administration
                </span>
              </div>
            </div>
            {filteredAdminNavigation.map((item) => {
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>
    </aside>
  )
}
