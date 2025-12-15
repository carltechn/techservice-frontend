import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, User, Wrench, ArrowRight } from 'lucide-react';
import { Input, Button } from '../components/ui';
import AuthBranding from '../components/auth/AuthBranding';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '', middle_name: '', last_name: '',
    email: '', password: '', password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await register(formData);
      if (res?.requires_verification) {
        setStatus('Registration successful. Please check your email to activate your account.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex">
      {/* Left side - Form */}
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
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Create account</h2>
              <p className="text-[var(--text-secondary)] mb-8">Join TechService to get technical support</p>
            </div>

            {status && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                {status}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First name" name="first_name" value={formData.first_name} onChange={handleChange} icon={User} placeholder="John" required />
                <Input label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" required />
              </div>

              <Input label="Middle name" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="William (optional)" />
              <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} icon={Mail} placeholder="you@example.com" required />

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]" placeholder="••••••••" minLength={8} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Input label="Confirm password" type={showPassword ? 'text' : 'password'} name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} icon={Lock} placeholder="••••••••" required />

              <Button type="submit" loading={loading} icon={ArrowRight} iconPosition="right" className="w-full mt-6" size="lg">
                Create account
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AuthBranding title="Get Started" subtitle="Create your account and start getting the technical support you need, when you need it." side="right" />
    </div>
  );
};

export default Register;
