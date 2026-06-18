import { useState } from 'react'
import { Shield, Lock, Users, AlertCircle } from 'lucide-react'
import { Card, Badge, Alert } from '@/components/ui'

interface Role {
  id: string
  role: string
  username: string
  access: string[]
  description: string
  color: 'default' | 'secondary' | 'outline' | 'destructive'
}

const ROLES: Role[] = [
  {
    id: 'admin',
    role: 'Administrator',
    username: 'admin',
    access: ['View all reports', 'Manage sources', 'Dispatch management', 'View analytics', 'Delete data', 'User management'],
    description: 'Full system access. Can create, modify, and delete any resource.',
    color: 'destructive',
  },
  {
    id: 'technician',
    role: 'Field Technician',
    username: 'tech',
    access: ['View assigned dispatch', 'Update repair status', 'Log maintenance notes', 'View source history'],
    description: 'Can view and update repair cases assigned to them. Used by field teams.',
    color: 'default',
  },
  {
    id: 'committee',
    role: 'Water Committee',
    username: 'committee',
    access: ['View local reports', 'Schedule maintenance', 'View district statistics', 'Submit reports'],
    description: 'Can access district-level data and submit water quality reports.',
    color: 'secondary',
  },
]

const PERMISSIONS = {
  'View all reports': {
    description: 'See all SMS reports submitted by community members',
    icon: 'eye',
  },
  'Manage sources': {
    description: 'Create, edit, or delete water infrastructure records',
    icon: 'edit',
  },
  'Dispatch management': {
    description: 'Assign technicians and manage repair workflows',
    icon: 'truck',
  },
  'View analytics': {
    description: 'Access trend data and export reports',
    icon: 'chart',
  },
  'Delete data': {
    description: 'Delete reports, sources, or repair cases (irreversible)',
    icon: 'trash',
  },
  'User management': {
    description: 'Create and manage user accounts (admin only)',
    icon: 'users',
  },
  'View assigned dispatch': {
    description: 'See repair cases assigned to this technician',
    icon: 'eye',
  },
  'Update repair status': {
    description: 'Change status and ETA of assigned repairs',
    icon: 'edit',
  },
  'Log maintenance notes': {
    description: 'Add notes and findings during repairs',
    icon: 'edit',
  },
  'View source history': {
    description: 'Access maintenance and report history for sources',
    icon: 'eye',
  },
  'View local reports': {
    description: 'See reports from the local district only',
    icon: 'eye',
  },
  'Schedule maintenance': {
    description: 'Schedule maintenance activities and send notifications',
    icon: 'calendar',
  },
  'View district statistics': {
    description: 'View water security statistics for the district',
    icon: 'chart',
  },
  'Submit reports': {
    description: 'Submit water quality issues or requests',
    icon: 'plus',
  },
}

export function UserManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(ROLES[0])

  return (
    <div className="page-container space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">User & Access Management</h1>
        <p className="text-neutral">Role-based access control (RBAC) and permissions</p>
      </div>

      {/* Info Alert */}
      <Alert variant="info">
        <Shield className="h-4 w-4 inline mr-2" />
        User accounts are currently configured via backend environment variables. Database-backed user management features will be available in future releases.
      </Alert>

      {/* Roles Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {ROLES.map((role) => (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all ${
              selectedRole?.id === role.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedRole(role)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-primary">{role.role}</h3>
                <Badge variant={role.color}>{role.username}</Badge>
              </div>
              <p className="text-sm text-neutral">{role.description}</p>
              <div className="flex items-center gap-1 text-xs text-neutral-dark pt-2 border-t">
                <Users className="h-3 w-3" />
                {role.access.length} permissions
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Role Details */}
      {selectedRole && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-4">{selectedRole.role} Permissions</h2>
            <p className="text-neutral mb-6">{selectedRole.description}</p>
          </div>

          {/* Credentials */}
          <Card className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-3">
              <Lock className="h-5 w-5 text-primary" />
              <h3 className="font-bold">Demo Credentials</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-neutral uppercase mb-1">Username</p>
                <code className="block bg-bgLight p-3 rounded font-mono">{selectedRole.username}</code>
              </div>
              <div>
                <p className="text-xs text-neutral uppercase mb-1">Password</p>
                <code className="block bg-bgLight p-3 rounded font-mono">
                  {selectedRole.id === 'admin' ? 'admin123' : selectedRole.id === 'technician' ? 'tech123' : 'committee123'}
                </code>
              </div>
            </div>
            <p className="text-xs text-neutral">
              <AlertCircle className="h-3 w-3 inline mr-1" />
              Change these credentials in production deployment.
            </p>
          </Card>

          {/* Permissions List */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Granted Permissions</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {selectedRole.access.map((perm) => (
                <div
                  key={perm}
                  className="border border-outline rounded-lg p-3 space-y-1 hover:bg-bgLight transition"
                >
                  <p className="font-semibold text-sm text-primary">{perm}</p>
                  <p className="text-xs text-neutral">
                    {PERMISSIONS[perm as keyof typeof PERMISSIONS]?.description || 'Permission'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Access Levels */}
          <Card className="space-y-3">
            <h3 className="font-bold">Dashboard Access</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  selectedRole.id === 'admin' ? 'bg-safe-green' : 
                  selectedRole.id === 'technician' ? 'bg-primary' : 
                  'bg-caution-yellow'
                }`}></div>
                <span><strong>Dashboard:</strong> Command Center</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  (selectedRole.id === 'admin' || selectedRole.id === 'technician') ? 'bg-safe-green' : 'bg-neutral/30'
                }`}></div>
                <span><strong>Dispatch:</strong> {selectedRole.id === 'admin' ? 'Full' : selectedRole.id === 'technician' ? 'Own cases' : 'No access'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  selectedRole.id === 'admin' ? 'bg-safe-green' : 'bg-neutral/30'
                }`}></div>
                <span><strong>Sources:</strong> {selectedRole.id === 'admin' ? 'Full' : 'No access'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  selectedRole.id === 'admin' ? 'bg-safe-green' : 'bg-neutral/30'
                }`}></div>
                <span><strong>Analytics:</strong> {selectedRole.id === 'admin' ? 'Full' : 'No access'}</span>
              </div>
            </div>
          </Card>
        </div>
      )}


    </div>
  )
}
