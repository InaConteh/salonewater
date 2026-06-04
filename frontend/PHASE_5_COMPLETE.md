# Phase 5 Complete: Frontend Pages & Features

**Status:** Complete

## Public portal

| Route | Feature |
|-------|---------|
| `/` | Landing, KPI cards, quick map search |
| `/map` | Leaflet map, district filter, search |
| `/find-water` | GPS / coordinates → nearby safe sources |
| `/health` | Tips from API with category filter |
| `/sms-guide` | SMS commands (English + Krio) |
| `/about`, `/privacy`, `/terms`, `/contact` | Support pages |

## Admin (JWT required)

| Route | Feature |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin` | Dashboard, reports feed, alerts |
| `/admin/sources` | CRUD water sources |
| `/admin/dispatch` | Repair case updates |
| `/admin/analytics` | Charts + CSV/JSON export |
| `/admin/alerts` | Prediction alerts |
| `/admin/users` | Role reference table |

## Integration

- `src/services/api.ts` — Axios client + JWT header
- `src/store/authStore.ts` — Zustand auth persistence

## Run

```bash
# Terminal 1 — API
cd backend && .\venv\Scripts\flask run

# Terminal 2 — Web
cd frontend && npm run dev
```

Set `VITE_API_URL=/api` in `frontend/.env` to use the Vite proxy, or `http://localhost:5000/api` for direct calls.

Admin login: **admin** / **admin123**
