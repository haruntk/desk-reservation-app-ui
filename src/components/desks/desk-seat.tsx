import type { DeskResponseDTO } from '@/types/desk'

export interface DeskSeatProps {
  desk: DeskResponseDTO
  isSelected: boolean
  status: 'available' | 'reserved' | 'mine'
  onClick: () => void
}

export function DeskSeat({ 
  desk, 
  isSelected, 
  status, 
  onClick 
}: DeskSeatProps) {
  const deskNumber = desk.deskId.toString()
  
  const getStatusStyles = () => {
    switch (status) {
      case 'available':
        return 'bg-turquoise-50 border-turquoise-200 text-turquoise-700 hover:border-turquoise-400 hover:bg-turquoise-100'
      case 'mine':
        return 'bg-turquoise-100 border-turquoise-500 text-turquoise-800'
      case 'reserved':
        return 'bg-turquoise-600 border-turquoise-700 text-white'
      default:
        return 'bg-background border-border text-muted-foreground'
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'mine':
        return 'Your desk'
      case 'reserved':
        return 'Reserved'
      default:
        return 'Unknown'
    }
  }

  return (
    <div
      className={`
        relative w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer
        flex items-center justify-center text-xs font-medium
        ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
        ${getStatusStyles()}
        ${isSelected ? 'ring-2 ring-turquoise-400 ring-offset-2' : ''}
      `}
      onClick={onClick}
      title={`${desk.deskName} - ${getStatusLabel()}`}
      aria-label={`Desk ${desk.deskName}, ${getStatusLabel()}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {deskNumber}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -inset-1 rounded-full border-2 border-turquoise-400 animate-pulse" />
      )}
    </div>
  )
}
