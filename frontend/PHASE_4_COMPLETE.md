# Phase 4 Complete: Frontend Architecture & Design System

**Status:** Complete

## Delivered

### 4.1 Design system
- Tailwind tokens: primary, success, warning, danger, neutral, surfaces
- Inter font via Google Fonts
- WCAG-focused focus rings and skip link

### 4.2 UI component library (`src/components/ui/`)
- `Button`, `Input`, `Card`, `Badge`, `Modal`, `Select`, `Alert`
- `StatusCard` with hover actions (Report Issue / View History)
- `ToastProvider` + `useToast()` for toast notifications

### 4.3 Layout (`src/components/common/`)
- `Navbar`, `Footer`, `Sidebar` (admin), `MainLayout`, `AdminLayout`
- Responsive `grid-dashboard` utility

### 4.4–4.5 Icons (`src/assets/icons/`)
- WaterDrop, Wrench, SunCloud, Book

## Pages & routes

| Route | Page |
|-------|------|
| `/` | Home landing |
| `/design-system` | Component showcase |
| `/admin` | Admin dashboard shell |
| `/admin/*` | Placeholder admin sections |

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Next: Phase 5

- Leaflet map + `GET /api/sources?format=geojson`
- Live API integration
- Public map page and admin CRUD
