import { useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDesksQuery, useAvailableDesksQuery } from "@/features/desks/api"
import { Badge } from "@/components/ui/badge"
import type { DeskAvailabilityRequestDTO } from "@/types/desk"

interface DeskSelectProps {
  value?: number
  onValueChange: (value: number) => void
  placeholder?: string
  disabled?: boolean
  floorId?: number
  availabilityRequest?: DeskAvailabilityRequestDTO
  showAvailabilityOnly?: boolean
}

export function DeskSelect({ 
  value, 
  onValueChange, 
  placeholder = "Select desk", 
  disabled,
  floorId,
  availabilityRequest,
  showAvailabilityOnly = false
}: DeskSelectProps) {
  const { data: allDesks = [], isLoading: isLoadingAll } = useDesksQuery()
  
  const { 
    data: availableDesks = [], 
    isLoading: isLoadingAvailable,
    isError: isAvailabilityError
  } = useAvailableDesksQuery(
    availabilityRequest || { StartTime: "", EndTime: "" },
    showAvailabilityOnly && !!availabilityRequest?.StartTime && !!availabilityRequest?.EndTime
  )

  const desks = useMemo(() => {
    let filteredDesks = showAvailabilityOnly && availabilityRequest?.StartTime && availabilityRequest?.EndTime 
      ? availableDesks 
      : allDesks

    if (floorId) {
      filteredDesks = filteredDesks.filter(desk => desk.floorId === floorId)
    }

    return filteredDesks
  }, [allDesks, availableDesks, floorId, showAvailabilityOnly, availabilityRequest])

  const isLoading = showAvailabilityOnly ? isLoadingAvailable : isLoadingAll

  const handleValueChange = (stringValue: string) => {
    onValueChange(parseInt(stringValue, 10))
  }

  const getPlaceholderText = () => {
    if (isLoading) return "Loading desks..."
    if (showAvailabilityOnly && isAvailabilityError) return "Error checking availability"
    if (desks.length === 0) {
      if (floorId) return "No desks available on this floor"
      return showAvailabilityOnly ? "No desks available for selected time" : "No desks available"
    }
    return placeholder
  }

  return (
    <Select 
      value={value ? value.toString() : ""} 
      onValueChange={handleValueChange}
      disabled={disabled || isLoading || desks.length === 0}
    >
      <SelectTrigger>
        <SelectValue placeholder={getPlaceholderText()} />
      </SelectTrigger>
      <SelectContent>
        {desks.map((desk) => (
          <SelectItem key={desk.deskId} value={desk.deskId.toString()}>
            <div className="flex items-center justify-between w-full">
              <span>{desk.deskName}</span>
              <div className="flex items-center gap-2 ml-2">
                <Badge variant="outline">Floor {desk.floorNumber}</Badge>
                {!showAvailabilityOnly && (
                  <Badge 
                    variant={desk.isAvailable ? "success" : "destructive"}
                  >
                    {desk.isAvailable ? "Available" : "Occupied"}
                  </Badge>
                )}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
