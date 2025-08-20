import { Link } from 'react-router-dom'
import { Building2, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { FloorResponseDTO } from '@/types/floor'

interface FloorCardProps {
  floor: FloorResponseDTO
}

export function FloorCard({ floor }: FloorCardProps) {
  const getFloorDescription = (deskCount: number) => {
    if (deskCount === 0) {
      return "No desks available on this floor"
    }
    
    const plural = deskCount === 1 ? 'desk' : 'desks'
    return `${deskCount} ${plural} available for reservation`
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Floor {floor.floorNumber}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-xs">
                  {floor.deskCount} {floor.deskCount === 1 ? 'desk' : 'desks'}
                </Badge>
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="mb-4">
          {getFloorDescription(floor.deskCount)}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Added {new Date(floor.createdAt).toLocaleDateString()}
          </div>
          
          <Button 
            asChild 
            variant={floor.deskCount > 0 ? "default" : "outline"}
            size="sm"
            disabled={floor.deskCount === 0}
          >
            <Link 
              to={`/app/floors/${floor.floorId}`}
              aria-label={`View desks on floor ${floor.floorNumber}`}
            >
              {floor.deskCount > 0 ? 'View Desks' : 'No Desks'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
