import { Outlet, Link, useLocation } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/store"

export function RootLayout() {
  const location = useLocation()
  const { user } = useAuth()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  if (isAuthPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">DeskReservation</span>
            </Link>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link to="/app">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/app/reservations">Reservations</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/app/desks">Desks</Link>
              </Button>
            </nav>
            <ThemeToggle />
            {user ? (
              <Button asChild variant="outline">
                <Link to="/app">Go to App</Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
