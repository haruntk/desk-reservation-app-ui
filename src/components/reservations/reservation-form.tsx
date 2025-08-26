import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Clock } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import { FloorSelect } from "./floor-select"
import { DeskSelect } from "./desk-select"
import { createReservationRequestSchema, type CreateReservationRequestData } from "@/lib/schemas"
import { toLocalISOString } from "@/lib/utils"
import { useCreateReservationMutation, useUpdateReservationMutation } from "@/features/reservations/api"
import type { ReservationResponseDTO } from "@/types/reservation"
import type { ApiError } from "@/lib/api"


interface ReservationFormProps {
  reservation?: ReservationResponseDTO
  onSuccess?: () => void
  onCancel?: () => void
  defaultDeskId?: number
  defaultFloorId?: number
}

export function ReservationForm({ reservation, onSuccess, onCancel, defaultDeskId, defaultFloorId }: ReservationFormProps) {
  const [selectedFloorId, setSelectedFloorId] = useState<number | undefined>(
    defaultFloorId || (reservation?.floorNumber ? undefined : undefined)
  )

  const isEditing = !!reservation

  const form = useForm<CreateReservationRequestData>({
    resolver: zodResolver(createReservationRequestSchema),
    defaultValues: {
      deskId: defaultDeskId || reservation?.deskId || 0,
      startTime: reservation?.startTime || "",
      endTime: reservation?.endTime || "",
    },
  })

  const createMutation = useCreateReservationMutation()
  const updateMutation = useUpdateReservationMutation()

  const startTime = form.watch("startTime")
  const endTime = form.watch("endTime")

  // Create availability request for desk filtering
  const availabilityRequest = startTime && endTime ? {
    StartTime: toLocalISOString(startTime),
    EndTime: toLocalISOString(endTime),
  } : undefined

  const getErrorMessage = (error: unknown, isEditing: boolean): string => {
    // Check if it's an API error with specific message
    if (error && typeof error === 'object' && 'message' in error) {
      const apiError = error as ApiError
      const message = apiError.message.toLowerCase()
      
      // Check for specific reservation conflict patterns
      if (message.includes('overlap') || message.includes('conflict') || 
          message.includes('already reserved') || message.includes('not available') ||
          message.includes('çakış') || message.includes('dolu') || 
          message.includes('mevcut rezervasyon')) {
        
        const action = isEditing ? 'güncellenemiyor' : 'oluşturulamıyor'
        return `Rezervasyon ${action}: Seçilen zaman diliminde masa başka bir kullanıcı tarafından rezerve edilmiş. Lütfen farklı bir zaman dilimi veya masa seçin.`
      }
      
      // Check for other specific error patterns
      if (message.includes('invalid time') || message.includes('time range') ||
          message.includes('geçersiz zaman') || message.includes('zaman aralığı')) {
        return `Geçersiz zaman aralığı. Bitiş zamanı başlangıç zamanından sonra olmalı ve geçmiş bir tarih seçilemez.`
      }
      
      if (message.includes('desk not found') || message.includes('masa bulunamadı')) {
        return `Seçilen masa bulunamadı. Lütfen geçerli bir masa seçin.`
      }
      
      if (message.includes('unauthorized') || message.includes('yetkisiz')) {
        return `Bu işlem için yetkiniz bulunmuyor. Lütfen giriş yapın veya yöneticinizle iletişime geçin.`
      }
      
      // Return the original error message if it's user-friendly
      if (apiError.message && apiError.message.length > 0) {
        return apiError.message
      }
    }
    
    // Fallback to generic error messages
    return isEditing 
      ? "Rezervasyon güncellenirken bir hata oluştu. Lütfen tekrar deneyin."
      : "Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
  }

  const onSubmit = async (data: CreateReservationRequestData) => {
    try {
      const requestData = {
        ...data,
        startTime: toLocalISOString(data.startTime),
        endTime: toLocalISOString(data.endTime),
      }
      
      if (isEditing && reservation) {
        await updateMutation.mutateAsync({
          id: reservation.reservationId,
          data: requestData,
        })
        toast.success("Rezervasyon başarıyla güncellendi!")
      } else {
        await createMutation.mutateAsync(requestData)
        toast.success("Rezervasyon başarıyla oluşturuldu!")
      }

      onSuccess?.()
      form.reset()
    } catch (error) {
      console.error("Reservation error:", error)
      
      // Show detailed error message with toast
      const errorMessage = getErrorMessage(error, isEditing)
      toast.error(errorMessage)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Reservation" : "Create New Reservation"}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update your desk reservation details"
            : "Book a desk for your preferred time slot"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         {/* Date and Time Selection */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="startTime"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="flex items-center gap-2">
                       <CalendarIcon className="h-4 w-4" />
                       Start Time
                     </FormLabel>
                     <FormControl>
                       <DateTimePicker
                         value={field.value}
                         onChange={field.onChange}
                         placeholder="Select start time"
                         minDate={new Date()}
                         disabled={isPending}
                         error={!!form.formState.errors.startTime}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="endTime"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel className="flex items-center gap-2">
                       <Clock className="h-4 w-4" />
                       End Time
                     </FormLabel>
                     <FormControl>
                       <DateTimePicker
                         value={field.value}
                         onChange={field.onChange}
                         placeholder="Select end time"
                         minDate={startTime ? new Date(startTime) : new Date()}
                         disabled={isPending}
                         error={!!form.formState.errors.endTime}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>

            {/* Floor Selection (for filtering) */}
            <FormItem>
              <FormLabel>Floor (Optional)</FormLabel>
              <FormControl>
                <FloorSelect
                  value={selectedFloorId}
                  onValueChange={setSelectedFloorId}
                  placeholder="Filter by floor"
                />
              </FormControl>
              <FormDescription>
                Select a floor to filter available desks, or leave empty to see all floors
              </FormDescription>
            </FormItem>

            {/* Desk Selection */}
            <FormField
              control={form.control}
              name="deskId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desk *</FormLabel>
                  <FormControl>
                    <DeskSelect
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      placeholder="Select a desk"
                      floorId={selectedFloorId}
                      availabilityRequest={availabilityRequest}
                      showAvailabilityOnly={!!availabilityRequest}
                    />
                  </FormControl>
                  <FormDescription>
                    {availabilityRequest 
                      ? "Showing only desks available for your selected time"
                      : "Select start and end times to see available desks"
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending 
                  ? (isEditing ? "Updating..." : "Creating...")
                  : (isEditing ? "Update Reservation" : "Create Reservation")
                }
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
        </form>
      </CardContent>
    </Card>
  )
}
