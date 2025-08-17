import { Link, useLocation } from 'react-router-dom'
import { 
  Monitor, 
  Building2, 
  Users, 
  Shield, 
  LayoutDashboard,
  CalendarCheck 
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
    roles: ['TeamLead', 'Admin']
  },
  {
    name: 'Users',
    href: '/app/users',
    icon: Users,
    roles: ['TeamLead', 'Admin']
  },
  {
    name: 'Roles',
    href: '/app/roles',
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

  return (
    <aside className="w-64 bg-card border-r border-border">
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
      </nav>
    </aside>
  )
}
