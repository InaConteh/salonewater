import { useEffect, useState } from 'react'
import { ChevronDown, Download, Filter, RefreshCw, AlertCircle, User, Calendar } from 'lucide-react'
import { LoadingState, ErrorState } from '@/components/common/LoadingState'
import { Badge, Button, Card, Input, Select } from '@/components/ui'
import { apiClient, type Report } from '@/services/api'
import { formatDate, getStatusLabel } from '@/lib/status'
import { useToast } from '@/contexts/ToastContext'

export function AdminReports() {
  const { showToast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Modal states
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'assign'>('view')
  const [assigningTeam, setAssigningTeam] = useState('')
  const [assigningEta, setAssigningEta] = useState('')
  const [assigningNotes, setAssigningNotes] = useState('')

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [causeFilter, setCauseFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [sortBy, setSortBy] = useState('timestamp-desc')
  const viewMode = 'card'

  // Pagination
  const [page, setPage] = useState(1)
  const itemsPerPage = 20
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginatedReports = filteredReports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Load all reports
  const loadReports = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const response = await apiClient.getReports()
      const allReports = response.data.reports || []
      setReports(allReports)
      setError(null)
    } catch (err) {
      setError('Failed to load reports. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  // Modal handlers
  const handleViewDetails = (report: Report) => {
    setSelectedReport(report)
    setModalMode('view')
  }

  const handleAssignClick = (report: Report) => {
    setSelectedReport(report)
    setModalMode('assign')
    setAssigningTeam('')
    setAssigningEta('')
    setAssigningNotes('')
  }

  const handleCreateDispatch = async () => {
    if (!selectedReport || !assigningTeam || !assigningEta) {
      showToast('Please fill in all required fields', 'warning')
      return
    }

    try {
      await apiClient.createDispatch({
        report_id: selectedReport.id,
        assigned_team: assigningTeam,
        eta: new Date(assigningEta).toISOString(),
        status: 'assigned',
        notes: assigningNotes,
      })
      showToast('Dispatch case created successfully', 'success')
      setSelectedReport(null)
      loadReports()
    } catch (err) {
      showToast('Failed to create dispatch case', 'danger')
    }
  }

  // Apply filters and sorting
  useEffect(() => {
    let filtered = reports

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.source_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cause_category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((r) => r.status === statusFilter)
    }

    // Cause filter
    if (causeFilter) {
      filtered = filtered.filter((r) => r.cause_category === causeFilter)
    }

    // District filter
    if (districtFilter) {
      filtered = filtered.filter((r) => r.district === districtFilter)
    }

    // Sorting
    switch (sortBy) {
      case 'timestamp-desc':
        filtered.sort(
          (a, b) =>
            new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
        )
        break
      case 'timestamp-asc':
        filtered.sort(
          (a, b) =>
            new Date(a.timestamp || '').getTime() - new Date(b.timestamp || '').getTime()
        )
        break
      case 'source-name':
        filtered.sort((a, b) => (a.source_name || '').localeCompare(b.source_name || ''))
        break
      case 'severity':
        filtered.sort((a, b) => {
          const severityOrder = { danger: 0, warning: 1, safe: 2 }
          const aOrder = severityOrder[a.status as keyof typeof severityOrder] || 3
          const bOrder = severityOrder[b.status as keyof typeof severityOrder] || 3
          return aOrder - bOrder
        })
        break
    }

    setFilteredReports(filtered)
    setPage(1)
  }, [reports, searchTerm, statusFilter, causeFilter, districtFilter, sortBy])

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(reports.map((r) => r.status))).filter(Boolean)
  const uniqueCauses = Array.from(new Set(reports.map((r) => r.cause_category))).filter(
    Boolean
  )
  const uniqueDistricts = Array.from(new Set(reports.map((r) => r.district))).filter(Boolean)

  // Export functionality
  const handleExport = (format: 'csv' | 'json') => {
    const data = filteredReports
    let content = ''
    let filename = `reports_${new Date().toISOString().split('T')[0]}`

    if (format === 'csv') {
      const headers = ['ID', 'Source', 'Status', 'Cause', 'District', 'Timestamp', 'Message']
      content = headers.join(',') + '\n'
      data.forEach((r) => {
        content += [
          r.id,
          r.source_name || r.source_id,
          r.status,
          r.cause_category,
          r.district,
          r.timestamp,
          r.message || '',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',') + '\n'
      })
      filename += '.csv'
    } else {
      content = JSON.stringify(data, null, 2)
      filename += '.json'
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) return <LoadingState />

  if (error) {
    return (
      <div className="page-container py-8">
        <ErrorState message={error} />
      </div>
    )
  }

  return (
    <div className="page-container space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">All Reports</h1>
          <p className="text-neutral">
            {filteredReports.length} of {reports.length} reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadReports(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="relative group">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-3 w-3" />
            </Button>
            <div className="absolute right-0 top-full hidden group-hover:block bg-white border border-outline rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleExport('csv')}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-bgLight"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-bgLight"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search Bar */}
          <Input
            label="Search"
            type="text"
            placeholder="Search by source name, ID, or cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'All statuses' },
                ...uniqueStatuses.map((s) => ({
                  value: s || '',
            label: getStatusLabel(s || ''),
                })),
              ]}
            />
            <Select
              label="Cause"
              value={causeFilter}
              onChange={(e) => setCauseFilter(e.target.value)}
              options={[
                { value: '', label: 'All causes' },
                ...uniqueCauses.map((c) => ({
                  value: c || '',
                  label: (c || '').replace(/_/g, ' '),
                })),
              ]}
            />
            <Select
              label="District"
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              options={[
                { value: '', label: 'All districts' },
                ...uniqueDistricts.map((d) => ({
                  value: d || '',
                  label: d || '',
                })),
              ]}
            />
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'timestamp-desc', label: 'Newest first' },
                { value: 'timestamp-asc', label: 'Oldest first' },
                { value: 'source-name', label: 'Source name (A-Z)' },
                { value: 'severity', label: 'Severity' },
              ]}
            />
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter || causeFilter || districtFilter) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setCauseFilter('')
                setDistrictFilter('')
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </Card>

      {/* Reports Display */}
      {paginatedReports.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Filter className="h-12 w-12 mx-auto text-neutral mb-4 opacity-50" />
            <p className="text-neutral text-lg">No reports match your filters.</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setCauseFilter('')
                setDistrictFilter('')
              }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        </Card>
      ) : viewMode === 'card' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onViewDetails={() => handleViewDetails(report)}
              onAssign={() => handleAssignClick(report)}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-outline bg-bgLight">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Source</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Cause</th>
                <th className="px-4 py-3 text-left font-semibold">District</th>
                <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-bgLight">
                  <td className="px-4 py-3 font-medium">{report.source_name || report.source_id}</td>
                  <td className="px-4 py-3">
                    <Badge variant={report.status as any}>{getStatusLabel(report.status || '')}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral">{report.cause_category?.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-neutral">{report.district}</td>
                  <td className="px-4 py-3 text-xs text-neutral">{formatDate(report.timestamp)}</td>
                  <td className="px-4 py-3 space-x-2 flex">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetails(report)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAssignClick(report)}
                    >
                      Dispatch
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Report Details/Assignment Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">
              {modalMode === 'view' ? 'Report Details' : 'Create Dispatch'} - {selectedReport.source_name || selectedReport.source_id}
            </h2>

            {modalMode === 'view' ? (
              /* View Mode */
              <div className="space-y-4">
                <div className="bg-bgLight rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-primary">Cause</p>
                      <p className="text-sm text-neutral">{selectedReport.cause_category?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant={selectedReport.status as any}>
                      {getStatusLabel(selectedReport.status || '')}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-neutral uppercase font-semibold">District</p>
                  <p className="text-sm">{selectedReport.district}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-neutral uppercase font-semibold">Reported</p>
                  <p className="text-sm">{formatDate(selectedReport.timestamp)}</p>
                </div>

                {selectedReport.message && (
                  <div className="space-y-2">
                    <p className="text-xs text-neutral uppercase font-semibold">Message</p>
                    <p className="text-sm text-neutral-dark italic">"{selectedReport.message}"</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-xs text-neutral uppercase font-semibold">Report ID</p>
                  <p className="font-mono text-xs text-neutral">{selectedReport.id}</p>
                </div>
              </div>
            ) : (
              /* Assign Mode */
              <div className="space-y-3">
                <div className="bg-bgLight rounded-lg p-3 space-y-2">
                  <p className="text-sm font-semibold text-primary">{selectedReport.source_name}</p>
                  <p className="text-xs text-neutral">{selectedReport.cause_category?.replace(/_/g, ' ')} • {selectedReport.district}</p>
                  {selectedReport.message && (
                    <p className="text-xs italic text-neutral-dark">"{selectedReport.message}"</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-neutral mb-1">Assigned Team *</label>
                  <select
                    value={assigningTeam}
                    onChange={(e) => setAssigningTeam(e.target.value)}
                    className="px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select a team...</option>
                    <option value="Western Response Unit">Western Response Unit</option>
                    <option value="Northern Field Team">Northern Field Team</option>
                    <option value="Eastern Maintenance Crew">Eastern Maintenance Crew</option>
                    <option value="Southern Rapid Response">Southern Rapid Response</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-neutral mb-1">ETA (Estimated Time of Arrival) *</label>
                  <input
                    type="datetime-local"
                    value={assigningEta}
                    onChange={(e) => setAssigningEta(e.target.value)}
                    className="px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-neutral mb-1">Notes</label>
                  <textarea
                    value={assigningNotes}
                    onChange={(e) => setAssigningNotes(e.target.value)}
                    placeholder="Add dispatch notes..."
                    className="px-3 py-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none h-20"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedReport(null)}>
                {modalMode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {modalMode === 'view' && (
                <Button variant="primary" onClick={() => setModalMode('assign')}>
                  Create Dispatch
                </Button>
              )}
              {modalMode === 'assign' && (
                <Button variant="primary" onClick={handleCreateDispatch}>
                  Assign & Dispatch
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Report Card Component
function ReportCard({
  report,
  onViewDetails,
  onAssign,
}: {
  report: Report
  onViewDetails: () => void
  onAssign: () => void
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-primary">{report.source_name || report.source_id}</p>
          <p className="text-xs text-neutral">{report.source_id?.slice(0, 8)}…</p>
        </div>
        <Badge variant={report.status as any}>{getStatusLabel(report.status || '')}</Badge>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <span className="font-medium text-neutral">Cause:</span>{' '}
          <span className="text-neutral-dark">{report.cause_category?.replace(/_/g, ' ')}</span>
        </p>
        <p>
          <span className="font-medium text-neutral">District:</span>{' '}
          <span className="text-neutral-dark">{report.district}</span>
        </p>
        <p>
          <span className="font-medium text-neutral">Reported:</span>{' '}
          <span className="text-xs text-neutral">{formatDate(report.timestamp)}</span>
        </p>
      </div>

      {report.message && (
        <p className="text-sm text-neutral-dark italic border-l-2 border-primary pl-2">
          "{report.message}"
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-2">
        <Button variant="primary" size="sm" className="flex-1" onClick={onViewDetails}>
          View Details
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={onAssign}>
          Assign
        </Button>
      </div>
    </Card>
  )
}
