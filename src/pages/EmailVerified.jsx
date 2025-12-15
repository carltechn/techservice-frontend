import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

const EmailVerified = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle className="bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm" />
      </div>
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-lg p-8 md:p-10 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <CheckCircle2 className="w-14 h-14 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-14 h-14 text-amber-500" />
          )}
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
          {isSuccess ? 'Email verified' : 'Verification issue'}
        </h1>
        <p className="text-[var(--text-secondary)] mb-6">
          {isSuccess
            ? 'Your account is now active. You can sign in and start using TechService.'
            : 'The verification link is invalid or expired. Please request a new email and try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/login">
            <Button icon={ArrowRight} iconPosition="right">Go to sign in</Button>
          </Link>
          {!isSuccess && (
            <Link to="/register">
              <Button variant="ghost">Create account</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;

