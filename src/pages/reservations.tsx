import { useState } from "react"
import { Plus, Calendar, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReservationList } from "@/components/reservations/reservation-list"
import { ReservationForm } from "@/components/reservations/reservation-form"
import { CalendarView } from "@/components/reservations/calendar-view"
import type { ReservationResponseDTO } from "@/types/reservation"

type ViewMode = "list" | "calendar" | "form"

export function ReservationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingReservation, setEditingReservation] = useState<ReservationResponseDTO | null>(null)

  const handleCreateNew = () => {
    setEditingReservation(null)
    setViewMode("form")
  }

  const handleEditReservation = (reservation: ReservationResponseDTO) => {
    setEditingReservation(reservation)
    setViewMode("form")
  }

  const handleFormSuccess = () => {
    setEditingReservation(null)
    setViewMode("list")
  }

  const handleFormCancel = () => {
    setEditingReservation(null)
    setViewMode("list")
  }

  const handleReservationClick = (reservation: ReservationResponseDTO) => {
    // For calendar view, we can show details or allow editing
    handleEditReservation(reservation)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reservations</h1>
          <p className="text-muted-foreground">
            Manage your desk reservations and book new slots
          </p>
        </div>
        
        {viewMode !== "form" && (
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        )}
      </div>

      {/* View Toggle */}
      {viewMode !== "form" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("calendar")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {viewMode === "list" && (
        <ReservationList onEditReservation={handleEditReservation} />
      )}

      {viewMode === "calendar" && (
        <CalendarView onReservationClick={handleReservationClick} />
      )}

      {viewMode === "form" && (
        <ReservationForm
          reservation={editingReservation || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}
