import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketsApi } from '../services/api';
import Dialog, { ConfirmDialog } from '../components/ui/Dialog';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import {
  Plus,
  Filter,
  Loader2,
  Ticket,
  ChevronRight,
  Clock,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  UserPlus,
} from 'lucide-react';

const Tickets = () => {
  const { user, isStaff, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'assign' | 'edit' | 'delete'
  const [actionTicket, setActionTicket] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    category: 'software',
    assigned_to: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadTickets = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;

      const response = await ticketsApi.getAll(params);
      setTickets(response.data || []);
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        total: response.total,
      });
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const ensureStaffOptions = async () => {
    if (!isAdmin() || staffOptions.length > 0) return;
    setStaffLoading(true);
    try {
      const res = await ticketsApi.getStaff();
      setStaffOptions(res.staff || []);
    } catch (error) {
      console.error('Failed to load staff', error);
    } finally {
      setStaffLoading(false);
    }
  };

  const openAction = async (ticket, type) => {
    setMenuOpenId(null);
    setActionTicket(ticket);
    setActionType(type);
    if (type === 'delete') {
      setConfirmOpen(true);
      return;
    }
    if (type === 'assign' || type === 'edit') {
      await ensureStaffOptions();
      setFormValues({
        title: ticket.title || '',
        description: ticket.description || '',
        priority: ticket.priority || 'medium',
        status: ticket.status || 'open',
        category: ticket.category || 'software',
        assigned_to: ticket.assignee?.id || ticket.assigned_to || '',
      });
    }
    setDialogOpen(true);
  };

  const closeAction = () => {
    setActionTicket(null);
    setActionType(null);
    setDialogOpen(false);
    setConfirmOpen(false);
    setFormValues({
      title: '',
      description: '',
      priority: 'medium',
      status: 'open',
      category: 'software',
      assigned_to: '',
    });
  };

  const handleActionSubmit = async (e) => {
    e?.preventDefault();
    if (!actionTicket || !actionType) return;
    setActionLoading(true);
    try {
      if (actionType === 'assign') {
        await ticketsApi.assign(actionTicket.id, formValues.assigned_to);
      } else if (actionType === 'edit') {
        const payload = {
          title: formValues.title,
          description: formValues.description,
          priority: formValues.priority,
          status: formValues.status,
          category: formValues.category,
          assigned_to: formValues.assigned_to || null,
        };
        await ticketsApi.update(actionTicket.id, payload);
      }
      await loadTickets(pagination?.currentPage || 1);
      closeAction();
    } catch (error) {
      console.error('Action failed', error);
      alert(error.message || 'Something went wrong');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!actionTicket) return;
    setActionLoading(true);
    try {
      await ticketsApi.delete(actionTicket.id);
      await loadTickets(pagination?.currentPage || 1);
      closeAction();
    } catch (error) {
      console.error('Delete failed', error);
      alert(error.message || 'Failed to delete ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      open: 'status-open',
      in_progress: 'status-in_progress',
      pending: 'status-pending',
      resolved: 'status-resolved',
      closed: 'status-closed',
    };
    return statusClasses[status] || 'status-open';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const contentWidth = "max-w-6xl w-full mx-auto";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${contentWidth}`}>
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
            Tickets
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {isStaff() ? 'Manage and respond to support tickets' : 'View and track your support requests'}
          </p>
        </div>
        {!isStaff() && (
          <Link
            to="/tickets/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-primary text-white font-semibold animate-fade-in"
          >
            <Plus className="w-5 h-5" />
            New Ticket
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-4 animate-fade-in stagger-1 ${contentWidth}`}>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {showFilters && (
            <>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)]"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)]"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)]"
              >
                <option value="">All Categories</option>
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="network">Network</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>

              <button
                onClick={() => setFilters({ status: '', priority: '', category: '' })}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tickets List */}
      <div className={`bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] animate-fade-in stagger-2 ${contentWidth}`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters' 
                : 'Create your first ticket to get started'}
            </p>
            {!isStaff() && !Object.values(filters).some(f => f) && (
              <Link
                to="/tickets/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl btn-primary text-white font-semibold"
              >
                <Plus className="w-5 h-5" />
                New Ticket
              </Link>
            )}
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
          >
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
                className="relative flex flex-col gap-3 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getPriorityIcon(ticket.priority) || <div className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[var(--text-muted)] font-mono">{ticket.ticket_number}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] capitalize">
                        {ticket.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mt-2 truncate">{ticket.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-secondary)] flex-wrap">
                      {isStaff() && <span>From: {ticket.user?.full_name}</span>}
                      {ticket.assignee && <span>Assigned: {ticket.assignee.full_name}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(ticket.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium capitalize hidden sm:inline-flex text-[var(--text-muted)]">
                    {ticket.priority}
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--text-muted)] hidden sm:block" />
                </div>

                {/* Admin actions */}
                {isAdmin() && (
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] hover:shadow-md transition-all"
                      onClick={() => setMenuOpenId(menuOpenId === ticket.id ? null : ticket.id)}
                    >
                      <MoreVertical className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                    {menuOpenId === ticket.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-30 overflow-hidden backdrop-blur-sm">
                        <div className="grid">
                          <button
                            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[var(--bg-secondary)] text-sm text-left transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => openAction(ticket, 'assign')}
                            disabled={staffLoading}
                          >
                            {staffLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Assign
                          </button>
                          <button
                            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[var(--bg-secondary)] text-sm text-left transition-colors"
                            onClick={() => openAction(ticket, 'edit')}
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button
                            className="w-full px-4 py-3 flex items-center gap-2 hover:bg-[var(--bg-secondary)] text-sm text-left text-red-500 transition-colors"
                            onClick={() => openAction(ticket, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} tickets)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => loadTickets(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => loadTickets(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action modal */}
      <Dialog
        open={dialogOpen && actionTicket && (actionType === 'assign' || actionType === 'edit')}
        onClose={closeAction}
        title={`${actionType === 'assign' ? 'Assign' : 'Edit'} ticket`}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleActionSubmit}>
          {actionType === 'edit' && (
            <>
              <Input
                label="Title"
                value={formValues.title}
                onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                required
              />
              <Textarea
                label="Description"
                value={formValues.description}
                onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                rows={3}
                required
              />
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={formValues.priority}
                onChange={(e) => setFormValues({ ...formValues, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={formValues.status}
                onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select
                value={formValues.category}
                onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <option value="software">Software</option>
                <option value="hardware">Hardware</option>
                <option value="network">Network</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Assigned to</label>
              <select
                value={formValues.assigned_to || ''}
                onChange={(e) => setFormValues({ ...formValues, assigned_to: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              >
                <option value="">Unassigned</option>
                {staffOptions
                  .filter((staff) => staff.id !== user?.id)
                  .map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.full_name} ({staff.role?.display_name || staff.role?.name || 'Staff'})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeAction} className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)]">Cancel</button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg btn-primary text-white disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen && actionTicket && actionType === 'delete'}
        onClose={closeAction}
        onConfirm={handleConfirmDelete}
        title="Delete ticket"
        message={`Delete "${actionTicket?.title}"? This cannot be undone.`}
        confirmText={actionLoading ? 'Deleting...' : 'Delete'}
        loading={actionLoading}
      />
    </div>
  );
};

export default Tickets;

