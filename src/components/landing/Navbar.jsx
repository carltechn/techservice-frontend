import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wrench } from 'lucide-react';
import { Button } from '../ui';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
              TechService
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {!loading && !isAuthenticated && (
              <>
                <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
                <Link to="/register"><Button>Get Started Free</Button></Link>
              </>
            )}
            {!loading && isAuthenticated && (
              <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)] animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                {link.name}
              </a>
            ))}
            {!loading && !isAuthenticated && (
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="secondary" className="w-full">Sign in</Button></Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}><Button className="w-full">Get Started Free</Button></Link>
              </div>
            )}
            {!loading && isAuthenticated && (
              <div className="pt-4">
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}><Button className="w-full">Go to Dashboard</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
