import { useState } from 'react'
import { Monitor, Clock, User, Calendar, X } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ReservationForm } from '@/components/reservations/reservation-form'
import { useCancelReservationMutation, useMyReservationsQuery } from '@/features/reservations/api'
import { useAuth } from '@/features/auth/store'
import type { DeskResponseDTO } from '@/types/desk'

interface DeskCardProps {
  desk: DeskResponseDTO
  floorNumber?: number
  onReservationSuccess?: () => void
}

export function DeskCard({ desk, floorNumber, onReservationSuccess }: DeskCardProps) {
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  
  const { user } = useAuth()
  const { data: myReservations = [] } = useMyReservationsQuery()
  const cancelMutation = useCancelReservationMutation()

  // Find if current user has an active reservation for this desk
  const myActiveReservation = myReservations.find(
    reservation => 
      reservation.deskId === desk.deskId && 
      reservation.status === 'Active' && 
      reservation.userId === user?.id
  )

  const handleReserve = () => {
    setShowReservationForm(true)
  }

  const handleCancelReservation = () => {
    setShowCancelDialog(true)
  }

  const confirmCancelReservation = async () => {
    if (!myActiveReservation) return

    try {
      await cancelMutation.mutateAsync(myActiveReservation.reservationId)
      toast.success('Reservation cancelled successfully')
      setShowCancelDialog(false)
      onReservationSuccess?.()
    } catch (error) {
      toast.error('Failed to cancel reservation')
      console.error('Cancel reservation error:', error)
    }
  }

  const handleReservationFormSuccess = () => {
    setShowReservationForm(false)
    onReservationSuccess?.()
    toast.success('Desk reserved successfully!')
  }

  const getStatusBadge = () => {
    if (myActiveReservation) {
      return <Badge variant="default" className="bg-blue-500">My Reservation</Badge>
    }
    
    if (desk.isAvailable) {
      return <Badge variant="success">Available</Badge>
    }
    
    return <Badge variant="destructive">Reserved</Badge>
  }

  const getNextReservationInfo = () => {
    if (!desk.nextReservationStart) return null
    
    const nextDate = new Date(desk.nextReservationStart)
    const isToday = nextDate.toDateString() === new Date().toDateString()
    
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>
          Next: {isToday ? 'Today' : format(nextDate, 'MMM d')} at {format(nextDate, 'h:mm a')}
        </span>
      </div>
    )
  }

  const canReserve = desk.isAvailable && !myActiveReservation
  const canCancel = myActiveReservation && myActiveReservation.status === 'Active'

  return (
    <>
      <Card className={`group hover:shadow-md transition-all duration-200 ${
        myActiveReservation ? 'border-blue-200 bg-blue-50/30' : 
        desk.isAvailable ? 'hover:border-green-200' : 'hover:border-red-200'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                myActiveReservation ? 'bg-blue-100 text-blue-600' :
                desk.isAvailable ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{desk.deskName}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Floor {desk.floorNumber || floorNumber}
                  </span>
                </div>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {myActiveReservation && (
            <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
                <User className="h-4 w-4" />
                <span>Your Reservation</span>
              </div>
              <div className="text-xs text-blue-600 space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(new Date(myActiveReservation.startTime), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(new Date(myActiveReservation.startTime), 'h:mm a')} - {' '}
                    {format(new Date(myActiveReservation.endTime), 'h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!desk.isAvailable && !myActiveReservation && (
            <CardDescription className="mb-3">
              This desk is currently reserved by another user.
              {getNextReservationInfo()}
            </CardDescription>
          )}

          {desk.isAvailable && !myActiveReservation && (
            <CardDescription className="mb-3">
              This desk is available for reservation.
              {getNextReservationInfo()}
            </CardDescription>
          )}

          <div className="flex gap-2 mt-4">
            {canReserve && (
              <Button 
                onClick={handleReserve}
                className="flex-1"
                aria-label={`Reserve ${desk.deskName}`}
              >
                Reserve Desk
              </Button>
            )}
            
            {canCancel && (
              <Button 
                variant="outline" 
                onClick={handleCancelReservation}
                disabled={cancelMutation.isPending}
                className="flex-1"
                aria-label={`Cancel reservation for ${desk.deskName}`}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel Reservation
              </Button>
            )}

            {!desk.isAvailable && !myActiveReservation && (
              <Button 
                variant="outline" 
                disabled 
                className="flex-1"
                aria-label={`${desk.deskName} is not available`}
              >
                Not Available
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reservation Form Dialog */}
      <Dialog open={showReservationForm} onOpenChange={setShowReservationForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reserve {desk.deskName}</DialogTitle>
            <DialogDescription>
              Book this desk on Floor {desk.floorNumber || floorNumber} for your preferred time slot.
            </DialogDescription>
          </DialogHeader>
          
          <ReservationForm
            onSuccess={handleReservationFormSuccess}
            onCancel={() => setShowReservationForm(false)}
            // Pre-fill the desk selection
            defaultDeskId={desk.deskId}
            defaultFloorId={desk.floorId}
          />
        </DialogContent>
      </Dialog>

      {/* Cancel Reservation Confirmation */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Reservation"
        description={`Are you sure you want to cancel your reservation for ${desk.deskName}? This action cannot be undone.`}
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        onConfirm={confirmCancelReservation}
        isLoading={cancelMutation.isPending}
      />
    </>
  )
}
