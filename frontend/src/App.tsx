import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, MainLayout } from '@/components/common'
import { ToastProvider } from '@/contexts/ToastContext'
import { Home } from '@/pages/Home'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPlaceholder } from '@/pages/admin/AdminPlaceholder'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/design-system" element={<DesignSystemPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route
              path="sources"
              element={
                <AdminPlaceholder
                  title="Water Sources"
                  description="Manage sources and status — Phase 5."
                />
              }
            />
            <Route
              path="dispatch"
              element={
                <AdminPlaceholder
                  title="Repair Dispatch"
                  description="Assign teams and track repairs — Phase 5."
                />
              }
            />
            <Route
              path="alerts"
              element={
                <AdminPlaceholder
                  title="Alerts & Warnings"
                  description="Drought and contamination alerts — Phase 5."
                />
              }
            />
            <Route
              path="tips"
              element={
                <AdminPlaceholder
                  title="Education Hub"
                  description="Health tips and guides — Phase 5."
                />
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
