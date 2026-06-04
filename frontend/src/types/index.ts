export type WaterStatus = 'green' | 'yellow' | 'red'

export interface WaterSource {
  id: string
  name: string
  status: WaterStatus
  latitude: number
  longitude: number
  district?: string | null
  description?: string | null
  root_cause?: string | null
  last_updated?: string | null
}

export type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export type ToastType = AlertVariant
