import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, MainLayout } from '@/components/common'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { ToastProvider } from '@/contexts/ToastContext'
import { Analytics } from '@/features/dashboard/Analytics'
import { DispatchCenter } from '@/features/dashboard/DispatchCenter'
import { SourceManagement } from '@/features/dashboard/SourceManagement'
import { UserManagement } from '@/features/dashboard/UserManagement'
import { About } from '@/pages/About'
import { AdminLogin } from '@/pages/AdminLogin'
import { AlternativeFinder } from '@/pages/AlternativeFinder'
import { Contact } from '@/pages/Contact'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { HealthLibrary } from '@/pages/HealthLibrary'
import { Home } from '@/pages/Home'
import { MapPage } from '@/pages/MapPage'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { SMSGuide } from '@/pages/SMSGuide'
import { Terms } from '@/pages/Terms'
import { AdminAlerts } from '@/pages/admin/AdminAlerts'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { HealthAssistant } from '@/pages/HealthAssistant'
function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/find-water" element={<AlternativeFinder />} />
            <Route path="/health" element={<HealthLibrary />} />
            <Route path="/health-assistant" element={<HealthAssistant />} />
            <Route path="/sms-guide" element={<SMSGuide />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="sources" element={<SourceManagement />} />
              <Route path="dispatch" element={<DispatchCenter />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="alerts" element={<AdminAlerts />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
