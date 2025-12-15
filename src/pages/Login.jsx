import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, Wrench, ArrowRight } from 'lucide-react';
import { Input, Button } from '../components/ui';
import AuthBranding from '../components/auth/AuthBranding';
import ThemeToggle from '../components/ThemeToggle';
import { buildPath } from '../utils/routes';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex">
      <AuthBranding 
        title="TechService"
        subtitle="Your dedicated technical support portal. Get help with software, hardware, and everything in between."
        side="left"
      />

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col">
        <div className="flex justify-end p-6">
          <ThemeToggle className="bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>TechService</span>
            </div>

            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Welcome back</h2>
              <p className="text-[var(--text-secondary)] mb-8">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="animate-fade-in stagger-2">
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="••••••••"
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

              <div className="flex justify-end animate-fade-in stagger-3">
                <Link to="/forgot-password" className="text-[var(--accent-primary)] text-sm font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full animate-fade-in stagger-3"
                size="lg"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-8 text-center text-[var(--text-secondary)] animate-fade-in stagger-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-[var(--accent-primary)] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
