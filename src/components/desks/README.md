# Desk Components

Professional React components for managing desk reservations with a station-based office layout.

## Architecture

The desk reservation system is built with a modular, reusable component architecture:

### Core Components

#### `FloorPlanView`
Main container component that orchestrates the entire desk reservation interface.
- **Props**: `desks`, `onReservationSuccess`, `onDeskSelect`
- **Features**: Desk grouping, reservation dialogs, status management
- **Responsibilities**: State management, API integration, user interactions

#### `StationLayout`
Renders a complete floor with station-based layout.
- **Props**: `floorNumber`, `desks`, `selectedDesk`, `onDeskClick`, `onExportFloorPlan`, `getDeskStatus`
- **Features**: 6 stations per floor (3 north, 3 south), export functionality
- **Responsibilities**: Floor-level organization, station positioning

#### `Station`
Individual station component with central table and 8 desk seats.
- **Props**: `station`, `selectedDesk`, `onDeskClick`, `getDeskStatus`
- **Layout**: 4 desks left + central table + 4 desks right
- **Responsibilities**: Station-level desk organization

#### `DeskSeat`
Individual clickable desk seat with status visualization.
- **Props**: `desk`, `isSelected`, `status`, `onClick`
- **States**: Available, Reserved, My Desk, Selected
- **Responsibilities**: Single desk interaction and visual state

#### `StationLegend`
Legend component explaining desk states and layout.
- **Features**: Visual examples of each desk state
- **Responsibilities**: User guidance and interface explanation

## Design Principles

### 1. **Separation of Concerns**
- Each component has a single, well-defined responsibility
- Business logic separated from presentation logic
- API calls isolated to container components

### 2. **Reusability**
- Components are designed to be reused across different contexts
- Props-driven configuration
- No hard-coded dependencies

### 3. **Accessibility**
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

### 4. **Type Safety**
- Full TypeScript coverage
- Exported interfaces for all props
- Proper type definitions

## Usage

```tsx
import { FloorPlanView } from '@/components/desks'

function DesksPage() {
  return (
    <FloorPlanView
      desks={desks}
      onReservationSuccess={() => refetch()}
      onDeskSelect={(deskId) => console.log('Selected:', deskId)}
    />
  )
}
```

## Component Hierarchy

```
FloorPlanView
├── StationLegend
└── StationLayout (per floor)
    └── Station (6 per floor)
        └── DeskSeat (8 per station)
```

## Styling

- Uses Tailwind CSS with design system tokens
- Responsive design principles
- Consistent spacing and typography
- Professional color scheme

## Future Enhancements

- Drag & drop desk assignment
- Real-time collaboration
- Advanced filtering options
- Mobile-optimized touch interactions
