import L from 'leaflet'
import type { WaterStatus } from '@/types'

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import icon from 'leaflet/dist/images/marker-icon.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default marker paths under Vite
const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

const STATUS_COLORS: Record<WaterStatus, string> = {
  green: '#28a745',
  yellow: '#ffc107',
  red: '#dc3545',
}

export function statusMarkerIcon(status: WaterStatus): L.DivIcon {
  const color = STATUS_COLORS[status] ?? '#6c757d'
  return L.divIcon({
    className: 'cf-map-marker',
    html: `<span style="
      background:${color};
      width:18px;height:18px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      display:block;
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

/** Center on Sierra Leone */
export const SIERRA_LEONE_CENTER: L.LatLngExpression = [8.5, -11.5]
export const DEFAULT_ZOOM = 7
