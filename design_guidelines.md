# Design Guidelines: Municipal Waste Management System

## Design Approach
**System-Based Approach**: Material Design principles adapted for data-heavy municipal operations. This utility-focused application prioritizes clarity, efficiency, and information hierarchy over visual flair. The design should feel professional, trustworthy, and optimized for daily operational use by municipal workers.

## Typography System

**Font Family**: Inter (Google Fonts) for interface, Roboto Mono for data/metrics
- **Headings**: Inter Semi-Bold (600)
  - H1: text-3xl (dashboard titles)
  - H2: text-2xl (section headers)
  - H3: text-xl (card titles)
- **Body**: Inter Regular (400)
  - Primary: text-base
  - Secondary/Meta: text-sm
- **Data/Metrics**: Roboto Mono Medium
  - Large metrics: text-4xl
  - Inline data: text-base

## Layout System

**Spacing Primitives**: Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: p-6
- Form field spacing: space-y-4

**Grid Structure**:
- Dashboard: 12-column grid for flexible layouts
- Collection point cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Data tables: Full-width with horizontal scroll on mobile
- Forms: Single column on mobile, 2-column on desktop (grid-cols-2)

**Container Strategy**:
- Main content: max-w-7xl mx-auto px-4
- Forms/modals: max-w-2xl
- Full-width map: w-full h-screen (with controls overlay)

## Core Component Library

### Navigation
**Top Navigation Bar**: Fixed header with municipal branding
- Logo/title on left
- Primary navigation (Dashboard, Collection Points, Routes, Employees, Vehicles)
- User profile and notifications on right
- Height: h-16, shadow-md for elevation

### Dashboard Layout
**Multi-Panel Interface**:
- Metrics row: 4 stat cards showing KPIs (grid-cols-4)
  - Total collection points, Active routes, Available vehicles, Alerts count
  - Each card: rounded-lg, shadow, p-6
- Map section: 2/3 width on desktop, full-width on mobile
- Sidebar panel: 1/3 width with recent alerts and quick actions

### Interactive Map
**Central Feature** (Leaflet/Mapbox integration):
- Full-height container: h-[600px] lg:h-[800px]
- Floating control panel overlay (top-right): Filters, legend, zoom controls
- Collection point markers: Color-coded by fill level
- Popup cards on marker click: rounded-lg shadow-lg p-4

### Data Tables
**Employee/Vehicle Management**:
- Sticky header row with sort indicators
- Row height: h-12 for touch targets
- Alternating row treatment for readability
- Action buttons column (right-aligned): Edit, Delete icons
- Pagination controls: Bottom-center
- Search/filter bar: Top with input fields and dropdowns

### Forms
**Collection Point/Employee Forms**:
- Section grouping with subtle dividers
- Label above input pattern
- Input fields: h-10 rounded border focus:ring
- Dropdown selects: Custom styled with chevron icons
- Multi-select for waste types: Checkbox group in grid-cols-2
- Form actions: Right-aligned primary/secondary button group
- Validation: Inline error messages below fields

### Cards
**Status Cards**:
- Rounded corners: rounded-lg
- Shadow: shadow-md
- Header with icon and title
- Content area: p-6
- Optional footer with actions

**Collection Point Cards**:
- Image/icon representation of waste type
- Status badge (top-right): Full/Partially Full/Empty
- Location and details list
- Quick action buttons at bottom

### Notifications
**Alert System**:
- Toast notifications: Fixed top-right position
- Alert types: Success, Warning, Error, Info
- Icon + message + dismiss button
- Auto-dismiss after 5 seconds
- Stack multiple notifications: space-y-2

### Modals/Dialogs
**Route Planning & Details**:
- Overlay backdrop: backdrop-blur-sm
- Modal container: max-w-4xl rounded-lg shadow-2xl
- Header: p-6 with close button
- Content: p-6 max-h-[70vh] overflow-y-auto
- Footer with actions: p-6 border-t

### Buttons & Actions
**Primary Actions**: Rounded, medium size (px-6 py-2.5)
**Secondary Actions**: Outlined style, same sizing
**Icon Buttons**: Square (w-10 h-10), rounded
**Floating Action Button**: Fixed bottom-right for quick add actions (w-14 h-14 rounded-full shadow-lg)

## Icons
**Heroicons** (outline for general UI, solid for emphasis):
- Navigation: Map, Users, Truck, Calendar icons
- Actions: Plus, Pencil, Trash, Bell
- Status: CheckCircle, ExclamationTriangle, InformationCircle
- Map controls: ZoomIn, ZoomOut, Filter

## Responsive Behavior
**Breakpoint Strategy**:
- Mobile (base): Stacked layouts, full-width components, bottom navigation
- Tablet (md): 2-column grids, side navigation visible
- Desktop (lg+): Full multi-column layouts, persistent sidebar

**Mobile Optimizations**:
- Map takes full viewport height on mobile
- Tables convert to card view on mobile
- Bottom navigation bar for primary actions
- Collapsible filters and sidebars

## Accessibility
- Focus rings: ring-2 ring-offset-2 on all interactive elements
- Sufficient contrast ratios for all text
- Icon buttons include aria-labels
- Form labels properly associated with inputs
- Keyboard navigation for all interactions

## Images
No hero image required. This is a functional dashboard application. Use:
- Municipal logo/branding in navigation
- Icon representations for waste types (plastic, organic, glass)
- Avatar placeholders for employee profiles
- Map tiles as primary visual element