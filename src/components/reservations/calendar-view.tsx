import { useState } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyReservationsQuery } from "@/features/reservations/api"
import type { ReservationResponseDTO } from "@/types/reservation"

interface CalendarViewProps {
  onReservationClick?: (reservation: ReservationResponseDTO) => void
}

export function CalendarView({ onReservationClick }: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { data: reservations = [], isLoading } = useMyReservationsQuery()

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Start on Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))
  const goToCurrentWeek = () => setCurrentWeek(new Date())

  const getReservationsForDay = (day: Date) => {
    return (reservations || []).filter(reservation => {
      const reservationStart = new Date(reservation.startTime)
      return isSameDay(reservationStart, day)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 border-green-300 text-green-800"
      case "Scheduled":
        return "bg-blue-100 border-blue-300 text-blue-800"
      case "Cancelled":
        return "bg-red-100 border-red-300 text-red-800"
      case "Completed":
        return "bg-gray-100 border-gray-300 text-gray-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToCurrentWeek}>
              Today
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day: Date) => {
            const dayReservations = getReservationsForDay(day)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div key={day.toISOString()} className="space-y-2">
                {/* Day Header */}
                <div className={`text-center p-2 rounded-md ${
                  isToday ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <div className="text-xs font-medium">
                    {format(day, "EEE")}
                  </div>
                  <div className="text-sm font-bold">
                    {format(day, "d")}
                  </div>
                </div>

                {/* Reservations for the day */}
                <div className="space-y-1 min-h-[100px]">
                  {dayReservations.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No reservations
                    </div>
                  ) : (
                    dayReservations.map((reservation) => (
                      <div
                        key={reservation.reservationId}
                        className={`p-2 rounded-md border cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(reservation.status)}`}
                        onClick={() => onReservationClick?.(reservation)}
                      >
                        <div className="text-xs font-medium truncate">
                          {reservation.deskName}
                        </div>
                        <div className="text-xs opacity-75">
                          {format(new Date(reservation.startTime), "HH:mm")} - {" "}
                          {format(new Date(reservation.endTime), "HH:mm")}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs mt-1"
                        >
                          Floor {reservation.floorNumber}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm font-medium mb-2">Status Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
