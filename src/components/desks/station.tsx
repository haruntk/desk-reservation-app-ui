import { DeskSeat } from './desk-seat'
import type { DeskResponseDTO } from '@/types/desk'
import type { StationData } from './station-layout'

export interface StationProps {
  station: StationData
  selectedDesk: DeskResponseDTO | null
  onDeskClick: (desk: DeskResponseDTO) => void
  getDeskStatus: (desk: DeskResponseDTO) => 'available' | 'reserved' | 'mine'
}

export function Station({ 
  station, 
  selectedDesk, 
  onDeskClick, 
  getDeskStatus 
}: StationProps) {
  const leftDesks = station.desks.slice(0, 4)
  const rightDesks = station.desks.slice(4, 8)

  return (
    <div className="relative bg-muted/20 border border-border rounded-lg p-4 shadow-sm">
      {/* Station Label */}
      <div className="absolute -top-3 left-4 bg-background px-2 py-1 text-xs font-medium text-muted-foreground border border-border rounded">
        Station {station.id}
      </div>

      {/* Station Layout */}
      <div className="flex items-center gap-4">
        {/* Left Side Desks */}
        <div className="flex flex-col gap-2">
          {leftDesks.map((desk) => (
            <DeskSeat
              key={desk.deskId}
              desk={desk}
              isSelected={selectedDesk?.deskId === desk.deskId}
              status={getDeskStatus(desk)}
              onClick={() => onDeskClick(desk)}
            />
          ))}
        </div>

        {/* Central Table */}
        <div className="bg-background border-2 border-border rounded-lg w-24 h-32 flex items-center justify-center shadow-sm">
          <div className="text-xs font-medium text-muted-foreground text-center">
            <div>Station</div>
            <div>{station.id}</div>
          </div>
        </div>

        {/* Right Side Desks */}
        <div className="flex flex-col gap-2">
          {rightDesks.map((desk) => (
            <DeskSeat
              key={desk.deskId}
              desk={desk}
              isSelected={selectedDesk?.deskId === desk.deskId}
              status={getDeskStatus(desk)}
              onClick={() => onDeskClick(desk)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
