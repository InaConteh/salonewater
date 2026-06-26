export type WaterStatus = 'green' | 'yellow' | 'red'

export type BadgeVariant = WaterStatus | 'neutral' | 'info' | 'primary' | 'warning' | 'danger' | 'safe'

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

export type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' | 'secondary'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export type ToastType = AlertVariant
