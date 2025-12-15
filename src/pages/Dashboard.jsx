import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ticketsApi } from '../services/api';
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  TrendingUp,
  Users,
  Loader2,
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin, isStaff } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, ticketsRes] = await Promise.all([
        ticketsApi.getStats(),
        ticketsApi.getAll({ per_page: 5 }),
      ]);
      setStats(statsRes.stats);
      setRecentTickets(ticketsRes.data || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Open Tickets',
      value: stats?.open || 0,
      icon: Ticket,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'In Progress',
      value: stats?.in_progress || 0,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      title: 'Resolved',
      value: stats?.resolved || 0,
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      title: 'Total Tickets',
      value: stats?.total || 0,
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50 dark:bg-violet-900/20',
    },
  ];

  if (isAdmin()) {
    statCards.push({
      title: 'Unassigned',
      value: stats?.unassigned || 0,
      icon: Users,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    });
    statCards.push({
      title: 'Critical',
      value: stats?.critical || 0,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    });
  }

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

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Here's what's happening with your tickets today.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={`${stat.bgColor} rounded-2xl p-6 card-hover animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">{stat.title}</p>
                <p className="text-4xl font-bold mt-2" style={{ fontFamily: 'Space Grotesk' }}>
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden animate-fade-in stagger-3">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ fontFamily: 'Space Grotesk' }}>
            Recent Tickets
          </h2>
          <Link
            to="/tickets"
            className="text-[var(--accent-primary)] font-medium flex items-center gap-1 hover:underline"
          >
            View all
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">No tickets yet</p>
            {!isStaff() && (
              <Link
                to="/tickets/new"
                className="inline-flex items-center gap-2 mt-4 text-[var(--accent-primary)] font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Create your first ticket
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex items-center gap-4 p-4 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm text-[var(--text-muted)] font-mono">
                      {ticket.ticket_number}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-medium truncate">{ticket.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {isStaff() ? `From: ${ticket.user?.full_name}` : `Category: ${ticket.category}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium capitalize ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[var(--text-muted)]" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

