import { useState } from 'react'
import { Monitor, Search, Filter, Grid, List, Building2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading'
import { DeskCard } from '@/components/desks/desk-card'
import { FloorPlanView } from '@/components/desks/floor-plan-view'
import { FloorSelect } from '@/components/reservations/floor-select'
import { useDesksQuery } from '@/features/desks/api'

type ViewMode = 'grid' | 'list' | 'floorplan'
type AvailabilityFilter = 'all' | 'available' | 'reserved'

export function DesksPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all')
  const [selectedFloorId, setSelectedFloorId] = useState<number | undefined>()
  const [viewMode, setViewMode] = useState<ViewMode>('floorplan')

  const { data: desks = [], isLoading, error, refetch } = useDesksQuery()

  // Filter desks based on search term, availability, and floor
  const filteredDesks = desks.filter((desk) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      if (!desk.deskName.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Availability filter
    if (availabilityFilter === 'available' && !desk.isAvailable) {
      return false
    }
    if (availabilityFilter === 'reserved' && desk.isAvailable) {
      return false
    }

    // Floor filter
    if (selectedFloorId && desk.floorId !== selectedFloorId) {
      return false
    }

    return true
  })

  const handleReservationSuccess = () => {
    refetch() // Refresh desk data after reservation changes
  }

  const clearFilters = () => {
    setSearchTerm('')
    setAvailabilityFilter('all')
    setSelectedFloorId(undefined)
  }

  const hasActiveFilters = searchTerm || availabilityFilter !== 'all' || selectedFloorId

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Available Desks</h1>
          <p className="text-muted-foreground">
            Browse and book available desks across all floors.
          </p>
        </div>
        
        <EmptyState
          icon={<Monitor className="h-8 w-8 text-muted-foreground" />}
          title="Failed to load desks"
          description="We couldn't load the desk information. Please try again."
          action={{
            label: "Retry",
            onClick: () => refetch(),
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
          <h1 className="text-3xl font-bold">Available Desks</h1>
          <p className="text-muted-foreground">
            Browse and book available desks across all floors.
          </p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  const availableCount = desks.filter(desk => desk.isAvailable).length
  const reservedCount = desks.length - availableCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Desks</h1>
          <p className="text-muted-foreground">
            Browse and book available desks across all floors. Total: {desks.length} desks
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'floorplan' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('floorplan')}
            aria-label="Floor plan view"
          >
            <Building2 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Desks</p>
                <p className="text-2xl font-bold">{desks.length}</p>
              </div>
              <Monitor className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              </div>
              <Badge variant="success" className="px-2 py-1">
                {availableCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Reserved</p>
                <p className="text-2xl font-bold text-red-600">{reservedCount}</p>
              </div>
              <Badge variant="destructive" className="px-2 py-1">
                {reservedCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search desks by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            aria-label="Search desks"
          />
        </div>

        {/* Floor Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium whitespace-nowrap">Floor:</span>
          <FloorSelect
            value={selectedFloorId}
            onValueChange={setSelectedFloorId}
            placeholder="All floors"
          />
        </div>

        {/* Availability Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Select value={availabilityFilter} onValueChange={(value: AvailabilityFilter) => setAvailabilityFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Desks</SelectItem>
              <SelectItem value="available">Available Only</SelectItem>
              <SelectItem value="reserved">Reserved Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {/* Desks Views */}
      {filteredDesks.length === 0 ? (
        <EmptyState
          icon={<Monitor className="h-8 w-8 text-muted-foreground" />}
          title={hasActiveFilters ? "No desks found" : "No desks available"}
          description={
            hasActiveFilters
              ? "No desks match your current filters. Try adjusting your search or filter criteria."
              : "There are no desks configured in the system yet."
          }
          action={
            hasActiveFilters ? {
              label: "Clear filters",
              onClick: clearFilters,
              variant: "outline"
            } : undefined
          }
        />
      ) : viewMode === 'floorplan' ? (
        <FloorPlanView 
          desks={filteredDesks} 
          onReservationSuccess={handleReservationSuccess}
        />
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredDesks.map((desk) => (
            <DeskCard 
              key={desk.deskId} 
              desk={desk} 
              onReservationSuccess={handleReservationSuccess}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredDesks.length > 0 && (
        <div className="text-sm text-muted-foreground pt-4 border-t">
          Showing {filteredDesks.length} of {desks.length} desks
          {hasActiveFilters && ' matching your filters'}
        </div>
      )}
    </div>
  )
}
