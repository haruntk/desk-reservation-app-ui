import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFloorsWithDesksQuery } from "@/features/floors/api"

interface FloorSelectProps {
  value?: number
  onValueChange: (value: number | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function FloorSelect({ value, onValueChange, placeholder = "Select floor", disabled }: FloorSelectProps) {
  const { data: floors = [], isLoading } = useFloorsWithDesksQuery()

  const handleValueChange = (stringValue: string) => {
    if (stringValue === "all") {
      onValueChange(undefined)
    } else {
      onValueChange(parseInt(stringValue, 10))
    }
  }

  return (
    <Select 
      value={value ? value.toString() : "all"} 
      onValueChange={handleValueChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Loading floors..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All floors</SelectItem>
        {floors.map((floor) => (
          <SelectItem key={floor.floorId} value={floor.floorId.toString()}>
            Floor {floor.floorNumber} ({floor.deskCount} desks)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
