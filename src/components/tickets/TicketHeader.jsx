import { useEffect, useState } from 'react';
import { ticketsApi } from '../../services/api';
import { Clock, Tag, User, AlertCircle, MoreVertical, UserPlus, Trash2 } from 'lucide-react';
import { Button, Select } from '../ui';
import { useAuth } from '../../hooks/useAuth';

const TicketHeader = ({ ticket, onUpdate, isStaff, isAdmin = false, onDeleted }) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [staffOptions, setStaffOptions] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(ticket.assignee?.id || ticket.assigned_to || '');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const handleStatusChange = async (e) => {
    setUpdating(true);
    try {
      await ticketsApi.update(ticket.id, { status: e.target.value });
      onUpdate();
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (e) => {
    setUpdating(true);
    try {
      await ticketsApi.update(ticket.id, { priority: e.target.value });
      onUpdate();
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    setSelectedAssignee(ticket.assignee?.id || ticket.assigned_to || '');
  }, [ticket]);

  const loadStaff = async () => {
    if (staffOptions.length > 0) return;
    try {
      const res = await ticketsApi.getStaff();
      setStaffOptions(res.staff || []);
    } catch (error) {
      console.error('Failed to load staff', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAssignee) return;
    setAssigning(true);
    try {
      await ticketsApi.assign(ticket.id, selectedAssignee);
      await onUpdate();
      setMenuOpen(false);
    } catch (error) {
      alert(error.message || 'Failed to assign ticket');
    } finally {
      setAssigning(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this ticket? This cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await ticketsApi.delete(ticket.id);
      onDeleted?.();
    } catch (error) {
      alert(error.message || 'Failed to delete ticket');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusClass = (status) => `status-${status}`;
  const getPriorityClass = (priority) => `priority-${priority}`;

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-[var(--text-muted)] font-mono mb-1">{ticket.ticket_number}</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>{ticket.title}</h1>
        </div>
        <div className="flex items-center gap-2 relative">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
          <span className={`text-sm font-medium capitalize ${getPriorityClass(ticket.priority)}`}>
            {ticket.priority}
          </span>
          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-[var(--bg-secondary)]"
                onClick={() => { setMenuOpen(!menuOpen); loadStaff(); }}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg z-10">
                  <div className="px-3 py-2 border-b border-[var(--border-color)] flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <select
                      value={selectedAssignee || ''}
                      onChange={(e) => setSelectedAssignee(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm"
                    >
                      <option value="">Assign...</option>
                      {staffOptions
                        .filter((staff) =>
                          staff.id !== user?.id &&
                          staff.id !== ticket?.user?.id &&
                          staff.id !== ticket?.assigned_to
                        )
                        .map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.full_name} ({staff.role?.display_name || staff.role?.name || 'Staff'})
                          </option>
                        ))}
                    </select>
                    <Button size="sm" onClick={handleAssign} loading={assigning} disabled={!selectedAssignee}>
                      Save
                    </Button>
                  </div>
                  <button
                    className="w-full px-3 py-2 flex items-center gap-2 hover:bg-[var(--bg-secondary)] text-sm text-red-500"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    <Trash2 className="w-4 h-4" /> {deleteLoading ? 'Deleting...' : 'Delete ticket'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[var(--text-secondary)] mb-6">{ticket.description}</p>

      {/* Meta info */}
      <div className="flex flex-wrap gap-6 text-sm text-[var(--text-secondary)] mb-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Created by: {ticket.user?.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <span className="capitalize">{ticket.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{new Date(ticket.created_at).toLocaleString()}</span>
        </div>
        {ticket.assignee && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>Assigned: {ticket.assignee.full_name}</span>
          </div>
        )}
      </div>

      {/* Staff controls */}
      {isStaff && (
        <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-color)]">
          <Select
            label="Status"
            value={ticket.status}
            onChange={handleStatusChange}
            options={statusOptions}
            disabled={updating}
            wrapperClassName="w-40"
          />
          <Select
            label="Priority"
            value={ticket.priority}
            onChange={handlePriorityChange}
            options={priorityOptions}
            disabled={updating}
            wrapperClassName="w-40"
          />
        </div>
      )}
    </div>
  );
};

export default TicketHeader;

