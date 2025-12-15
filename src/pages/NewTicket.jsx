import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketsApi } from '../services/api';
import {
  ArrowLeft,
  Send,
  Loader2,
  Monitor,
  HardDrive,
  Wifi,
  User,
  HelpCircle,
} from 'lucide-react';

const NewTicket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'software',
    priority: 'medium',
  });

  const categories = [
    { value: 'software', label: 'Software', icon: Monitor, desc: 'Application issues, bugs, errors' },
    { value: 'hardware', label: 'Hardware', icon: HardDrive, desc: 'Physical equipment problems' },
    { value: 'network', label: 'Network', icon: Wifi, desc: 'Internet, connectivity issues' },
    { value: 'account', label: 'Account', icon: User, desc: 'Login, password, permissions' },
    { value: 'other', label: 'Other', icon: HelpCircle, desc: 'Other technical issues' },
  ];

  const priorities = [
    { value: 'low', label: 'Low', desc: 'Minor issue, can wait' },
    { value: 'medium', label: 'Medium', desc: 'Moderate impact' },
    { value: 'high', label: 'High', desc: 'Significant impact' },
    { value: 'critical', label: 'Critical', desc: 'System down, urgent' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await ticketsApi.create(formData);
      navigate(`/tickets/${response.ticket.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 animate-fade-in">
        <Link
          to="/tickets"
          className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
            Create New Ticket
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Describe your issue and we'll help you resolve it
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 animate-fade-in stagger-1">
          <h2 className="text-lg font-semibold mb-4">What type of issue is this?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${formData.category === cat.value
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }
                `}
              >
                <cat.icon className={`w-6 h-6 mb-2 ${formData.category === cat.value ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`} />
                <p className="font-medium text-sm">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 space-y-5 animate-fade-in stagger-2">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors"
              placeholder="Brief summary of your issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors resize-none"
              placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you've already tried."
              required
            />
          </div>
        </div>

        {/* Priority */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 animate-fade-in stagger-3">
          <h2 className="text-lg font-semibold mb-4">How urgent is this?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {priorities.map((pri) => (
              <button
                key={pri.value}
                type="button"
                onClick={() => setFormData({ ...formData, priority: pri.value })}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${formData.priority === pri.value
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                    : 'border-[var(--border-color)] hover:border-[var(--text-muted)]'
                  }
                `}
              >
                <p className={`font-semibold mb-1 priority-${pri.value}`}>{pri.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{pri.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 animate-fade-in stagger-4">
          <Link
            to="/tickets"
            className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl btn-primary text-white font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Ticket
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTicket;

