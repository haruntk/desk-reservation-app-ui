import { Card, CardContent } from '@/components/ui/card'
import { Station } from './station'
import type { DeskResponseDTO } from '@/types/desk'

export interface StationLayoutProps {
  floorNumber: string
  desks: DeskResponseDTO[]
  selectedDesk: DeskResponseDTO | null
  onDeskClick: (desk: DeskResponseDTO) => void
  getDeskStatus: (desk: DeskResponseDTO) => 'available' | 'reserved' | 'mine'
}

export interface StationData {
  id: number
  desks: DeskResponseDTO[]
}

export function StationLayout({ 
  floorNumber, 
  desks, 
  selectedDesk, 
  onDeskClick, 
  getDeskStatus 
}: StationLayoutProps) {
  // Organize desks into stations (6 stations per floor, 8 desks per station)
  const organizeIntoStations = (floorDesks: DeskResponseDTO[]): StationData[] => {
    const stations: StationData[] = []
    const desksPerStation = 8
    const totalStations = 6

    for (let stationIndex = 0; stationIndex < totalStations; stationIndex++) {
      const startIndex = stationIndex * desksPerStation
      const stationDesks = floorDesks.slice(startIndex, startIndex + desksPerStation)
      
      if (stationDesks.length > 0) {
        stations.push({
          id: stationIndex + 1,
          desks: stationDesks
        })
      }
    }

    return stations
  }

  const stations = organizeIntoStations(desks)
  const availableDesks = desks.filter(desk => desk.isAvailable).length

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div>
            <h3 className="text-lg font-semibold">Floor {floorNumber}</h3>
            <p className="text-sm text-muted-foreground">
              {desks.length} desks • {availableDesks} available • {stations.length} stations
            </p>
          </div>
        </div>
        
        {/* Station-Based Office Layout */}
        <div 
          className="relative bg-background border border-border mx-auto shadow-sm p-8"
          data-floor={floorNumber}
          style={{ 
            width: '1000px',
            height: '600px',
            minWidth: '1000px'
          }}
        >
          {/* Subtle grid background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--muted-foreground)) 0.5px, transparent 0.5px),
                linear-gradient(to bottom, hsl(var(--muted-foreground)) 0.5px, transparent 0.5px)
              `,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Station Layout: 3 stations north, 3 stations south */}
          <div className="relative w-full h-full">
            {/* North Row - 3 Stations */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-8">
              {stations.slice(0, 3).map((station) => (
                <Station 
                  key={`north-${station.id}`}
                  station={station}
                  selectedDesk={selectedDesk}
                  onDeskClick={onDeskClick}
                  getDeskStatus={getDeskStatus}
                />
              ))}
            </div>

            {/* South Row - 3 Stations */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8">
              {stations.slice(3, 6).map((station) => (
                <Station 
                  key={`south-${station.id}`}
                  station={station}
                  selectedDesk={selectedDesk}
                  onDeskClick={onDeskClick}
                  getDeskStatus={getDeskStatus}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
