import { Card, CardContent } from '@/components/ui/card'

export function StationLegend() {
  const legendItems = [
    {
      id: 'available',
      label: 'Available',
      className: 'bg-turquoise-50 border-turquoise-200 text-turquoise-700',
      number: '1'
    },
    {
      id: 'reserved',
      label: 'Reserved',
      className: 'bg-turquoise-600 border-turquoise-700 text-white',
      number: '2'
    },
    {
      id: 'mine',
      label: 'My Desk',
      className: 'bg-turquoise-100 border-turquoise-500 text-turquoise-800',
      number: '3'
    },
    {
      id: 'selected',
      label: 'Selected',
      className: 'bg-turquoise-50 border-turquoise-200 text-turquoise-700',
      number: '4',
      hasRing: true
    }
  ]

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">Station-Based Office Layout</h3>
            <p className="text-sm text-muted-foreground mt-1">
              6 stations • 8 desks per station • Click any desk to reserve
            </p>
          </div>
          <div className="flex items-center gap-8">
            {legendItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`
                  relative w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                  ${item.className}
                `}>
                  {item.number}
                  {item.hasRing && (
                    <div className="absolute -inset-1 rounded-full border-2 border-turquoise-400 animate-pulse" />
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
