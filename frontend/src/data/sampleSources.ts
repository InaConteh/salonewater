import type { WaterSource } from '@/types'

/** Sample data for Phase 4 UI demos (replaced by API in Phase 5). */
export const SAMPLE_SOURCES: WaterSource[] = [
  {
    id: 'demo-1',
    name: 'Kambia Central Borehole',
    status: 'yellow',
    latitude: 9.9551,
    longitude: -12.9858,
    district: 'Kambia',
    root_cause: 'pump_failure',
    last_updated: new Date().toISOString(),
    description: 'Community borehole — reduced flow reported.',
  },
  {
    id: 'demo-2',
    name: 'Bo Market Handpump',
    status: 'green',
    latitude: 7.9648,
    longitude: -11.7388,
    district: 'Bo',
    last_updated: new Date().toISOString(),
    description: 'Operating normally.',
  },
  {
    id: 'demo-3',
    name: 'Makeni Well Station',
    status: 'red',
    latitude: 8.8864,
    longitude: -12.044,
    district: 'Bombali',
    root_cause: 'contamination',
    last_updated: new Date(Date.now() - 86400000).toISOString(),
    description: 'Do not use until tested.',
  },
]
