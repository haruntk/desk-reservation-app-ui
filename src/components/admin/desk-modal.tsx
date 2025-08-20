import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDeskRequestSchema, updateDeskRequestSchema, type CreateDeskRequestData, type UpdateDeskRequestData } from "@/lib/schemas"
import { useCreateDeskMutation, useUpdateDeskMutation } from "@/features/desks/api"
import { useFloorsQuery } from "@/features/floors/api"
import type { DeskResponseDTO } from "@/types/desk"

interface DeskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  desk?: DeskResponseDTO
  onSuccess?: () => void
}

export function DeskModal({ open, onOpenChange, desk, onSuccess }: DeskModalProps) {
  const isEditing = !!desk
  const { data: floors = [], isLoading: isLoadingFloors } = useFloorsQuery()

  const form = useForm<CreateDeskRequestData | UpdateDeskRequestData>({
    resolver: zodResolver(isEditing ? updateDeskRequestSchema : createDeskRequestSchema),
    defaultValues: {
      deskName: desk?.deskName || "",
      floorId: desk?.floorId || 0,
    },
  })

  const createMutation = useCreateDeskMutation()
  const updateMutation = useUpdateDeskMutation()

  const onSubmit = async (data: CreateDeskRequestData | UpdateDeskRequestData) => {
    try {
      if (isEditing && desk) {
        await updateMutation.mutateAsync({
          id: desk.deskId,
          data: data as UpdateDeskRequestData,
        })
        toast.success("Desk updated successfully!")
      } else {
        await createMutation.mutateAsync(data as CreateDeskRequestData)
        toast.success("Desk created successfully!")
      }

      onSuccess?.()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(isEditing ? "Failed to update desk" : "Failed to create desk")
      console.error("Desk error:", error)
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
            {isEditing ? "Edit Desk" : "Create New Desk"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the desk information below."
              : "Add a new desk to the system. Choose a floor and provide a name."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="deskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desk Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Desk A1, Hot Desk 01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="floorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    value={field.value ? field.value.toString() : ""}
                    disabled={isLoadingFloors}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingFloors ? "Loading floors..." : "Select a floor"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floors.map((floor) => (
                        <SelectItem key={floor.floorId} value={floor.floorId.toString()}>
                          Floor {floor.floorNumber} ({floor.deskCount} desks)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  : (isEditing ? "Update Desk" : "Create Desk")
                }
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
