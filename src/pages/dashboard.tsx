import { Link } from 'react-router-dom'
import { Calendar, Monitor, Building2, BarChart3 } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/store'
import { useMyReservationsQuery } from '@/features/reservations/api'
import { useDesksQuery } from '@/features/desks/api'
import { useFloorsQuery } from '@/features/floors/api'

export function DashboardPage() {
  const { user } = useAuth()
  
  // Fetch data
  const { data: reservations = [], isLoading: reservationsLoading } = useMyReservationsQuery()
  const { data: desks = [], isLoading: desksLoading } = useDesksQuery()
  const { data: floors = [], isLoading: floorsLoading } = useFloorsQuery()
  
  // Calculate stats
  const activeReservations = reservations.filter(r => r.status === 'Active' || r.status === 'Scheduled')
  const availableDesks = desks.filter(d => d.isAvailable).length
  const recentReservations = reservations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Scheduled": return "secondary" 
      case "Cancelled": return "destructive"
      case "Completed": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your desk reservation system.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Reservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {reservationsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{activeReservations.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Active reservations
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link to="/app/reservations">View All</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Desks</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {desksLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{availableDesks}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Ready to book now
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link to="/app/desks">Browse Desks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Office Floors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {floorsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{floors.length}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Total floors available
            </p>
            <Button asChild size="sm" variant="outline" className="mt-4">
              <Link to="/app/floors">View Floors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest desk reservation activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : recentReservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity to display</p>
              <p className="text-sm">Start by making your first desk reservation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div key={reservation.reservationId} className="flex items-center justify-between p-3 border rounded hover:bg-accent/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{reservation.deskName}</span>
                      <Badge variant={getStatusBadgeVariant(reservation.status)} className="text-xs">
                        {reservation.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(reservation.startTime), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Floor {reservation.floorNumber}
                  </div>
                </div>
              ))}
              {recentReservations.length > 0 && (
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/app/reservations">View All Reservations</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
