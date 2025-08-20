import { useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock, MapPin, Edit, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FloorSelect } from "./floor-select"
import { useMyReservationsQuery, useCancelReservationMutation } from "@/features/reservations/api"
import type { ReservationResponseDTO, ReservationStatus } from "@/types/reservation"

interface ReservationListProps {
  onEditReservation?: (reservation: ReservationResponseDTO) => void
}

interface ReservationFilters {
  status?: ReservationStatus | "all"
  floorId?: number
  startDate?: string
  endDate?: string
}

export function ReservationList({ onEditReservation }: ReservationListProps) {
  const [filters, setFilters] = useState<ReservationFilters>({
    status: "all"
  })
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean
    reservationId?: number
    reservationName?: string
  }>({ open: false })

  const { data: reservations = [], isLoading, error } = useMyReservationsQuery()
  const cancelMutation = useCancelReservationMutation()

  // Filter reservations based on current filters
  const filteredReservations = (reservations || []).filter((reservation) => {
    if (filters.status && filters.status !== "all" && reservation.status !== filters.status) {
      return false
    }
    
    if (filters.floorId && reservation.floorNumber !== filters.floorId) {
      return false
    }
    
    if (filters.startDate) {
      const reservationDate = new Date(reservation.startTime)
      const filterDate = new Date(filters.startDate)
      if (reservationDate < filterDate) return false
    }
    
    if (filters.endDate) {
      const reservationDate = new Date(reservation.startTime)
      const filterDate = new Date(filters.endDate)
      filterDate.setHours(23, 59, 59) // End of day
      if (reservationDate > filterDate) return false
    }
    
    return true
  })

  const handleCancelReservation = (reservationId: number, reservationName: string) => {
    setCancelDialog({
      open: true,
      reservationId,
      reservationName
    })
  }

  const confirmCancelReservation = async () => {
    if (!cancelDialog.reservationId) return

    try {
      await cancelMutation.mutateAsync(cancelDialog.reservationId)
      toast.success("Reservation cancelled successfully")
      setCancelDialog({ open: false })
    } catch (error) {
      toast.error("Failed to cancel reservation")
      console.error("Cancel reservation error:", error)
    }
  }

  const getStatusBadgeVariant = (status: ReservationStatus) => {
    switch (status) {
      case "Active":
        return "success"
      case "Scheduled":
        return "default"
      case "Cancelled":
        return "destructive"
      case "Completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const canEditReservation = (reservation: ReservationResponseDTO) => {
    return (reservation.status === "Active" || reservation.status === "Scheduled") && reservation.isUpcoming
  }

  const canCancelReservation = (reservation: ReservationResponseDTO) => {
    return (reservation.status === "Active" || reservation.status === "Scheduled") && !reservation.isPast
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Failed to load reservations. Please try again.</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value: string) => setFilters(prev => ({ ...prev, status: value as ReservationStatus | "all" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Floor Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Floor</label>
              <FloorSelect
                value={filters.floorId}
                onValueChange={(value) => setFilters(prev => ({ ...prev, floorId: value }))}
                placeholder="All floors"
              />
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Clear Filters */}
          {(filters.status !== "all" || filters.floorId || filters.startDate || filters.endDate) && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFilters({ status: "all" })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reservations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            Your Reservations ({filteredReservations.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No reservations found</p>
                <p>
                  {reservations.length === 0 
                    ? "You haven't made any reservations yet."
                    : "No reservations match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <Card 
                key={reservation.reservationId} 
                className="relative cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onEditReservation?.(reservation)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{reservation.deskName}</h4>
                          <Badge variant={getStatusBadgeVariant(reservation.status)}>
                            {reservation.status}
                          </Badge>
                          {reservation.isActive && (
                            <Badge variant="outline">Current</Badge>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Floor {reservation.floorNumber}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(reservation.startTime), "MMM d, yyyy 'at' h:mm a")} - {" "}
                            {format(new Date(reservation.endTime), "h:mm a")}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Duration: {reservation.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {canEditReservation(reservation) && onEditReservation && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditReservation(reservation)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      
                      {canCancelReservation(reservation) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelReservation(reservation.reservationId, reservation.deskName)
                          }}
                          disabled={cancelMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={(open) => setCancelDialog({ open })}
        title="Cancel Reservation"
        description={`Are you sure you want to cancel your reservation for ${cancelDialog.reservationName}? This action cannot be undone.`}
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        onConfirm={confirmCancelReservation}
        isLoading={cancelMutation.isPending}
      />
    </div>
  )
}
