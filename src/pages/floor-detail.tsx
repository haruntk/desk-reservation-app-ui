import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Monitor, Search, Filter, Grid, List } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { LoadingSpinner } from '@/components/ui/loading'
import { DeskCard } from '@/components/desks/desk-card'
import { useDesksByFloorQuery } from '@/features/desks/api'

type ViewMode = 'grid' | 'list'
type AvailabilityFilter = 'all' | 'available' | 'reserved'

export function FloorDetailPage() {
  const { floorId } = useParams<{ floorId: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const floorIdNumber = floorId ? parseInt(floorId, 10) : 0
  
  const { data: desks = [], isLoading, error, refetch } = useDesksByFloorQuery(floorIdNumber)

  // Get floor number from the first desk (since all desks on this floor have the same floorNumber)
  const floorNumber = desks.length > 0 ? parseInt(desks[0].floorNumber, 10) : floorIdNumber

  // Filter desks based on search term and availability
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

    return true
  })

  const handleReservationSuccess = () => {
    refetch() // Refresh desk data after reservation changes
  }

  // Remove the old loading and error logic since we only use desk API now

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/floors" aria-label="Back to floors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Floors
            </Link>
          </Button>
        </div>
        
        <EmptyState
          icon={<Monitor className="h-8 w-8 text-muted-foreground" />}
          title="Failed to load floor details"
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/floors" aria-label="Back to floors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Floors
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  // Remove the floor check since we're only using desk data

  const availableCount = desks.filter(desk => desk.isAvailable).length
  const reservedCount = desks.length - availableCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/floors" aria-label="Back to floors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Floors
            </Link>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Floor {floorNumber}</h1>
            <p className="text-muted-foreground">
              {desks.length} {desks.length === 1 ? 'desk' : 'desks'} available on this floor
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
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
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>

      {/* Desks Grid/List */}
      {filteredDesks.length === 0 ? (
        <EmptyState
          icon={<Monitor className="h-8 w-8 text-muted-foreground" />}
          title={searchTerm || availabilityFilter !== 'all' ? "No desks found" : "No desks available"}
          description={
            searchTerm || availabilityFilter !== 'all'
              ? "No desks match your current filters. Try adjusting your search or filter criteria."
              : "There are no desks configured on this floor yet."
          }
          action={
            (searchTerm || availabilityFilter !== 'all') ? {
              label: "Clear filters",
              onClick: () => {
                setSearchTerm("")
                setAvailabilityFilter('all')
              },
              variant: "outline"
            } : undefined
          }
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
              floorNumber={floorNumber}
              onReservationSuccess={handleReservationSuccess}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredDesks.length > 0 && (
        <div className="text-sm text-muted-foreground pt-4 border-t">
          Showing {filteredDesks.length} of {desks.length} desks
          {(searchTerm || availabilityFilter !== 'all') && ' matching your filters'}
        </div>
      )}
    </div>
  )
}
