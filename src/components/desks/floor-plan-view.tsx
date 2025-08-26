import { useState } from 'react'
import { Monitor, Calendar, User, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ReservationForm } from '@/components/reservations/reservation-form'
import { StationLayout } from './station-layout'
import { StationLegend } from './station-legend'
import { useMyReservationsQuery, useReservationsByDeskQuery } from '@/features/reservations/api'
import { useAuth } from '@/features/auth/store'
import type { DeskResponseDTO } from '@/types/desk'

interface FloorPlanViewProps {
  desks: DeskResponseDTO[]
  onReservationSuccess?: () => void
  onDeskSelect?: (deskId: string) => void
}





export function FloorPlanView({ desks, onReservationSuccess, onDeskSelect }: FloorPlanViewProps) {
  const [selectedDesk, setSelectedDesk] = useState<DeskResponseDTO | null>(null)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const { user } = useAuth()
  const { data: myReservations = [] } = useMyReservationsQuery()
  
  // Fetch all reservations for the selected desk
  const { data: deskReservations = [], isLoading: reservationsLoading } = useReservationsByDeskQuery(
    selectedDesk?.deskId || 0
  )

  // Group desks by floor
  const desksByFloor = desks.reduce((acc, desk) => {
    const floorKey = desk.floorNumber
    if (!acc[floorKey]) {
      acc[floorKey] = []
    }
    acc[floorKey].push(desk)
    return acc
  }, {} as Record<string, DeskResponseDTO[]>)

  const handleDeskClick = (desk: DeskResponseDTO) => {
    setSelectedDesk(desk)
    
    // Call the onDeskSelect callback if provided
    onDeskSelect?.(desk.deskId.toString())
    
    // Show information for reserved desks
    if (!desk.isAvailable) {
      const status = getDeskStatus(desk)
      if (status === 'mine') {
        toast.info(`This is your reserved desk: ${desk.deskName}`)
      } else {
        toast.warning(`Desk ${desk.deskName} is currently reserved by another user`)
      }
    }
  }

  const handleReserveDesk = (desk: DeskResponseDTO) => {
    if (!desk.isAvailable) {
      const status = getDeskStatus(desk)
      if (status === 'mine') {
        toast.info(`You already have ${desk.deskName} reserved. Check "My Reservations" to manage it.`)
      } else {
        toast.error(`Cannot reserve ${desk.deskName} - This desk is currently occupied by another user`)
      }
      return
    }
    
    setSelectedDesk(desk)
    setShowReservationForm(true)
  }

  const handleReservationSuccess = () => {
    setShowReservationForm(false)
    setSelectedDesk(null)
    onReservationSuccess?.()
  }

  const getDeskStatus = (desk: DeskResponseDTO) => {
    const myActiveReservation = myReservations.find(
      reservation => 
        reservation.deskId === desk.deskId && 
        (reservation.status === 'Active' || reservation.status === 'Scheduled') &&
        reservation.userId === user?.id
    )

    if (myActiveReservation) return 'mine'
    if (!desk.isAvailable) return 'reserved'
    return 'available'
  }



  return (
    <div className="space-y-8">
      {/* Station-Based Layout Legend */}
      <StationLegend />

      {/* Floor Plans with Station Layout */}
      {Object.entries(desksByFloor).map(([floorNumber, floorDesks]) => (
        <StationLayout
          key={floorNumber}
          floorNumber={floorNumber}
          desks={floorDesks}
          selectedDesk={selectedDesk}
          onDeskClick={handleDeskClick}
          getDeskStatus={getDeskStatus}
        />
      ))}

      {/* Comprehensive Desk Reservations Dialog */}
      {selectedDesk && (
        <Dialog open={!!selectedDesk} onOpenChange={() => setSelectedDesk(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                {selectedDesk.deskName} - All Reservations
              </DialogTitle>
              <DialogDescription>
                Floor {selectedDesk.floorNumber} • Complete reservation history and schedule
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Current Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    selectedDesk.isAvailable ? 'bg-turquoise-400' : 
                    getDeskStatus(selectedDesk) === 'mine' ? 'bg-turquoise-500' : 'bg-turquoise-600'
                  }`} />
                  <div>
                    <span className="font-medium">
                      {selectedDesk.isAvailable ? 'Available Now' : 
                       getDeskStatus(selectedDesk) === 'mine' ? 'Your Reserved Desk' : 'Currently Occupied'}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {selectedDesk.isAvailable ? 'Ready for immediate booking' : 
                       getDeskStatus(selectedDesk) === 'mine' ? 'You have an active reservation here' : 'Reserved by another user'}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={
                    selectedDesk.isAvailable ? 'success' : 
                    getDeskStatus(selectedDesk) === 'mine' ? 'default' : 'destructive'
                  }
                >
                  {selectedDesk.isAvailable ? 'Available' : 
                   getDeskStatus(selectedDesk) === 'mine' ? 'My Desk' : 'Reserved'}
                </Badge>
              </div>

              {/* Reservation Prevention for Occupied Desks */}
              {!selectedDesk.isAvailable && (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                    <div>
                      <h4 className="font-medium text-destructive">Cannot Reserve This Desk</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getDeskStatus(selectedDesk) === 'mine' 
                          ? 'You already have this desk reserved. Manage your reservation in "My Reservations".'
                          : 'This desk is currently reserved by another user. Please choose an available desk or wait for this one to become free.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Reservations for This Desk */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  All Reservations for {selectedDesk.deskName}
                </h4>
                
                {reservationsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-3 bg-muted/30 rounded border">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : deskReservations.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No reservations found for this desk</p>
                    <p className="text-xs">This desk has never been reserved</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {deskReservations
                      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                      .map((reservation) => (
                      <div key={reservation.reservationId} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {reservation.userId === user?.id ? 'You' : 'User'}
                            </span>
                          </div>
                          <Badge 
                            variant={
                              reservation.status === 'Active' ? 'default' :
                              reservation.status === 'Scheduled' ? 'secondary' :
                              reservation.status === 'Completed' ? 'outline' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {reservation.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(new Date(reservation.startTime), "MMM d, yyyy 'at' h:mm a")} - {" "}
                              {format(new Date(reservation.endTime), "h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Duration: {reservation.duration}</span>
                          </div>
                          {reservation.isActive && (
                            <div className="flex items-center gap-2 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs font-medium">Currently Active</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedDesk.isAvailable ? (
                  <Button 
                    onClick={() => handleReserveDesk(selectedDesk)}
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Reserve This Desk
                  </Button>
                ) : getDeskStatus(selectedDesk) === 'mine' ? (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedDesk(null)
                      window.location.href = '/app/reservations'
                    }}
                    className="flex-1"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Manage My Reservations
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    disabled
                    className="flex-1 opacity-50"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Cannot Reserve - Occupied
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedDesk(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Reservation Form Dialog */}
      {showReservationForm && selectedDesk && (
        <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reserve {selectedDesk.deskName}</DialogTitle>
              <DialogDescription>
                Book this desk for your preferred time slot
              </DialogDescription>
            </DialogHeader>
            <ReservationForm
              defaultDeskId={selectedDesk.deskId}
              defaultFloorId={selectedDesk.floorId}
              onSuccess={handleReservationSuccess}
              onCancel={() => setShowReservationForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
