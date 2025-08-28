import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <motion.aside 
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-card border-r border-border scrollbar-thin overflow-y-auto"
    >
      {/* App Logo/Name */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 p-4 border-b border-border"
      >
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md"
        >
          <Monitor className="h-4 w-4" />
        </motion.div>
        <div>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Desk Reservation</h1>
          <p className="text-xs text-muted-foreground">System</p>
        </div>
      </motion.div>
      
      <nav className="flex flex-col space-y-1 p-4">
        {filteredNavigation.map((item, index) => {
          const isActive = location.pathname === item.href
          
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          )
        })}

        {/* Admin Section */}
        {showAdminSection && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="pt-4 pb-2"
            >
              <div className="flex items-center space-x-2 px-3 py-1">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Administration
                </span>
              </div>
            </motion.div>
            {filteredAdminNavigation.map((item, index) => {
              const isActive = location.pathname === item.href
              
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="admin-sidebar-indicator"
                        className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </>
        )}
      </nav>
    </motion.aside>
  )
}
