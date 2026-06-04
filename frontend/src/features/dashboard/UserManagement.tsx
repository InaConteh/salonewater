import { Card } from '@/components/ui'
import { Alert } from '@/components/ui/Alert'

/** Role accounts are configured on the server (.env). Full user CRUD is Phase 6+. */
const ROLES = [
  {
    role: 'admin',
    username: 'admin',
    access: 'Full: sources, dispatch, analytics, delete',
  },
  {
    role: 'technician',
    username: 'tech',
    access: 'Dispatch, maintenance logs',
  },
  {
    role: 'committee',
    username: 'committee',
    access: 'Maintenance scheduling, local reports',
  },
]

export function UserManagement() {
  return (
    <div className="page-container space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">User management</h1>
        <p className="text-neutral">Role-based access (configured via API environment)</p>
      </header>

      <Alert variant="info" title="Server-managed accounts">
        User passwords are set in backend <code className="text-sm">.env</code> variables
        (ADMIN_USERNAME, TECHNICIAN_USERNAME, etc.). A database-backed user module can be
        added in a future release.
      </Alert>

      <Card padding="sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-neutral">
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Username</th>
              <th className="py-2">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {ROLES.map((u) => (
              <tr key={u.role} className="border-b border-neutral-light/80">
                <td className="py-3 pr-4 font-medium capitalize">{u.role}</td>
                <td className="py-3 pr-4 font-mono">{u.username}</td>
                <td className="py-3 text-neutral-dark">{u.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
