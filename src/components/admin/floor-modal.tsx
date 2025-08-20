import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createFloorRequestSchema, updateFloorRequestSchema, type CreateFloorRequestData, type UpdateFloorRequestData } from "@/lib/schemas"
import { useCreateFloorMutation, useUpdateFloorMutation } from "@/features/floors/api"
import type { FloorResponseDTO } from "@/types/floor"

interface FloorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  floor?: FloorResponseDTO
  onSuccess?: () => void
}

export function FloorModal({ open, onOpenChange, floor, onSuccess }: FloorModalProps) {
  const isEditing = !!floor

  const form = useForm<CreateFloorRequestData | UpdateFloorRequestData>({
    resolver: zodResolver(isEditing ? updateFloorRequestSchema : createFloorRequestSchema),
    defaultValues: {
      floorNumber: floor?.floorNumber || 0,
    },
  })

  const createMutation = useCreateFloorMutation()
  const updateMutation = useUpdateFloorMutation()

  const onSubmit = async (data: CreateFloorRequestData | UpdateFloorRequestData) => {
    try {
      if (isEditing && floor) {
        await updateMutation.mutateAsync({
          id: floor.floorId,
          data: data as UpdateFloorRequestData,
        })
        toast.success("Floor updated successfully!")
      } else {
        await createMutation.mutateAsync(data as CreateFloorRequestData)
        toast.success("Floor created successfully!")
      }

      onSuccess?.()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(isEditing ? "Failed to update floor" : "Failed to create floor")
      console.error("Floor error:", error)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    onOpenChange(newOpen)
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Floor" : "Create New Floor"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the floor information below."
              : "Add a new floor to the system. Provide a floor number."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="e.g. 1, 2, 3"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending 
                  ? (isEditing ? "Updating..." : "Creating...")
                  : (isEditing ? "Update Floor" : "Create Floor")
                }
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
