import * as React from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Menu, X, Home, Calendar, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/app",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Reservations",
    href: "/app/reservations",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: "Desks",
    href: "/app/desks",
    icon: <MapPin className="h-4 w-4" />,
  },
]

export function RootLayout() {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const isAuthPage = ['/login'].includes(location.pathname)

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <Monitor className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Desk Reservation
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Only show nav items if user is authenticated */}
              {user && (
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== "/app" && location.pathname.startsWith(item.href))
                    return (
                      <motion.div
                        key={item.href}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                            isActive
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="navbar-indicator"
                              className="absolute inset-0 bg-primary/5 rounded-lg border border-primary/20"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              
              {/* Theme Toggle */}
              <ThemeToggle variant="compact" />
              
              {/* Auth Buttons */}
              {user ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild variant="outline">
                    <Link to="/app">Go to App</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild variant="ghost">
                      <Link to="/login">Login</Link>
                    </Button>
                  </motion.div>

                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle variant="compact" />
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative"
                  >
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Menu className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Navigation - Only show for authenticated users */}
          {user && (
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 border-t">
                    {navItems.map((item, index) => {
                      const isActive = location.pathname === item.href || (item.href !== "/app" && location.pathname.startsWith(item.href))
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            to={item.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200",
                              isActive
                                ? "text-primary bg-primary/10 border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.nav>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
