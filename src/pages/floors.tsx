import { useState } from 'react'
import { Building2, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading'
import { FloorCard } from '@/components/floors/floor-card'
import { useFloorsWithDesksQuery } from '@/features/floors/api'

export function FloorsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: floors = [], isLoading, error } = useFloorsWithDesksQuery()

  // Filter floors based on search term
  const filteredFloors = floors.filter((floor) => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      floor.floorNumber.toString().includes(searchLower) ||
      `floor ${floor.floorNumber}`.includes(searchLower)
    )
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Office Floors</h1>
          <p className="text-muted-foreground">
            Browse available floors and their desk layouts.
          </p>
        </div>
        
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
          title="Failed to load floors"
          description="We couldn't load the floor information. Please try again."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
            variant: "outline"
          }}
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Office Floors</h1>
          <p className="text-muted-foreground">
            Browse available floors and their desk layouts.
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Office Floors</h1>
        <p className="text-muted-foreground">
          Browse available floors and their desk layouts. Click on a floor to view available desks.
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search floors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          aria-label="Search floors"
        />
      </div>

      {/* Floor Grid */}
      {filteredFloors.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-muted-foreground" />}
          title={searchTerm ? "No floors found" : "No floors available"}
          description={
            searchTerm 
              ? `No floors match "${searchTerm}". Try adjusting your search.`
              : "There are no floors configured in the system yet."
          }
          action={
            searchTerm ? {
              label: "Clear search",
              onClick: () => setSearchTerm(""),
              variant: "outline"
            } : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFloors.map((floor) => (
            <FloorCard key={floor.floorId} floor={floor} />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredFloors.length > 0 && (
        <div className="text-sm text-muted-foreground pt-4 border-t">
          Showing {filteredFloors.length} of {floors.length} floors
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  )
}
