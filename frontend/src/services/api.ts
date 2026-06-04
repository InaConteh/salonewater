import axios from 'axios'
import type { WaterSource, WaterStatus } from '@/types'

const baseURL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cf_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Kpis {
  total_sources: number
  status_green: number
  status_yellow: number
  status_red: number
  reports_last_30_days: number
  open_repair_cases: number
}

export interface Tip {
  id: number
  title: string
  message: string
  category?: string
}

export interface Report {
  id: string
  source_id: string
  reporter_phone?: string | null
  cause_category: string
  notes?: string | null
  timestamp?: string | null
}

export interface RepairCase {
  id: string
  report_id?: string | null
  assigned_team?: string | null
  eta?: string | null
  status: string
  notes?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Trends {
  period_days: number
  total_reports: number
  by_cause: Record<string, number>
  by_day: Record<string, number>
  risk_sources: Array<{
    source_id: string
    source_name: string
    report_count_30d: number
    risk_level: string
    suggested_action?: string
  }>
  alerts: Array<{ type: string; source_id: string; message: string }>
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: { type: 'Point'; coordinates: [number, number] }
    properties: WaterSource
  }>
}

export interface NearbySource extends WaterSource {
  distance_km: number
}

export const apiClient = {
  login: (username: string, password: string) =>
    api.post<{ access_token: string; role: string }>('/auth/login', {
      username,
      password,
    }),

  getKpis: () => api.get<Kpis>('/analytics/kpis'),

  getTrends: (days = 30) =>
    api.get<Trends>('/analytics/trends', { params: { days } }),

  getTrendsCsvUrl: (days = 30) =>
    `${baseURL}/analytics/trends?days=${days}&format=csv`,

  getSources: () =>
    api.get<{ sources: WaterSource[] }>('/sources'),

  getSourcesGeoJson: () =>
    api.get<GeoJsonFeatureCollection>('/sources', {
      params: { format: 'geojson' },
    }),

  getSource: (id: string) => api.get<WaterSource>(`/sources/${id}`),

  getSourceReports: (id: string) =>
    api.get<{ reports: Report[] }>(`/sources/${id}/reports`),

  createSource: (payload: Partial<WaterSource>) =>
    api.post<WaterSource>('/sources', payload),

  updateSource: (id: string, payload: Partial<WaterSource>) =>
    api.patch<WaterSource>(`/sources/${id}`, payload),

  deleteSource: (id: string) => api.delete(`/sources/${id}`),

  getNearby: (lat: number, lon: number, limit = 5) =>
    api.get<{ sources: NearbySource[] }>('/sources/nearby', {
      params: { lat, lon, limit },
    }),

  getTips: () => api.get<{ tips: Tip[] }>('/tips'),

  getReports: (sourceId?: string) =>
    api.get<{ reports: Report[] }>('/reports', {
      params: sourceId ? { source_id: sourceId } : undefined,
    }),

  createReport: (payload: {
    source_id: string
    cause_category: string
    reporter_phone?: string
    notes?: string
    auto_dispatch?: boolean
  }) => api.post<Report>('/reports', payload),

  getDispatch: () => api.get<{ repair_cases: RepairCase[] }>('/dispatch'),

  createDispatch: (payload: Partial<RepairCase>) =>
    api.post<RepairCase>('/dispatch', payload),

  updateDispatch: (id: string, payload: Partial<RepairCase>) =>
    api.patch<RepairCase>(`/dispatch/${id}`, payload),

  getMaintenanceReminders: () =>
    api.get<{ reminders: unknown[] }>('/dispatch/reminders'),
}

export const CAUSE_OPTIONS = [
  { value: 'drought', label: 'Drought' },
  { value: 'broken_pump', label: 'Broken pump' },
  { value: 'dry_well', label: 'Dry well' },
  { value: 'contamination', label: 'Contamination' },
  { value: 'overuse', label: 'Overuse' },
  { value: 'seasonal', label: 'Seasonal' },
] as const

export const STATUS_OPTIONS: { value: WaterStatus; label: string }[] = [
  { value: 'green', label: 'Safe' },
  { value: 'yellow', label: 'Caution' },
  { value: 'red', label: 'Unsafe' },
]
