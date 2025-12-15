import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Wrench } from 'lucide-react';
import { Input, Button } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';
import AuthBranding from '../components/auth/AuthBranding';
import { authApi } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setStatus(res.message || 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Unable to send reset link right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex">
      <AuthBranding
        title="Reset password"
        subtitle="We’ll email you a secure link to create a new password."
        side="left"
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
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Forgot password</h2>
              <p className="text-[var(--text-secondary)] mb-8">Enter the email you used to create your account.</p>
            </div>

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                placeholder="you@example.com"
                required
                wrapperClassName="animate-fade-in stagger-1"
              />

              <Button
                type="submit"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full animate-fade-in stagger-2"
                size="lg"
              >
                Send reset link
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

