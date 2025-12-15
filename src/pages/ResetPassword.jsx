import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Wrench, Mail } from 'lucide-react';
import { Input, Button } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';
import AuthBranding from '../components/auth/AuthBranding';
import { authApi } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const emailFromLink = searchParams.get('email') || '';

  const [form, setForm] = useState({
    email: emailFromLink,
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isTokenMissing = useMemo(() => !token || !emailFromLink, [token, emailFromLink]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        ...form,
        token,
      });
      setStatus(res.message || 'Password updated. You can now sign in.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message || 'Unable to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex">
      <AuthBranding
        title="Create a new password"
        subtitle="Keep your account secure with a strong password."
        side="right"
      />

      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            ← Back to login
          </Link>
          <ThemeToggle className="bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>TechService</span>
            </div>

            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Reset password</h2>
              <p className="text-[var(--text-secondary)] mb-8">Enter your new password below.</p>
            </div>

            {isTokenMissing && (
              <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 animate-fade-in">
                This reset link is missing information. Please use the link from your email.
              </div>
            )}

            {status && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 animate-fade-in">
                {status}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
                placeholder="you@example.com"
                required
                wrapperClassName="animate-fade-in stagger-1"
              />

              <div className="animate-fade-in stagger-2">
                <label className="block text-sm font-medium mb-2">New password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="••••••••"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                icon={Lock}
                placeholder="••••••••"
                required
                wrapperClassName="animate-fade-in stagger-3"
              />

              <Button
                type="submit"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full animate-fade-in stagger-4"
                size="lg"
                disabled={isTokenMissing}
              >
                Update password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

