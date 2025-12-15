import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '../ui';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] rounded-full bg-[var(--accent-primary)]/10 blur-3xl" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] rounded-full bg-[var(--accent-secondary)]/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span>100% Free Technical Support</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in stagger-1" style={{ fontFamily: 'Space Grotesk' }}>
            Technical Support{' '}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            Get expert help with your software and hardware issues. Real-time chat, smart ticketing, and a team that actually cares — completely free.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-3">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} iconPosition="right">Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16 animate-fade-in stagger-4">
            <p className="text-sm text-[var(--text-muted)] mb-4">Trusted by 2,000+ users worldwide</p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'Space Grotesk' }}>5,000+</p>
                <p className="text-sm text-[var(--text-muted)]">Tickets Resolved</p>
              </div>
              <div className="w-px h-12 bg-[var(--border-color)]" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'Space Grotesk' }}>&lt;2h</p>
                <p className="text-sm text-[var(--text-muted)]">Avg Response</p>
              </div>
              <div className="w-px h-12 bg-[var(--border-color)]" />
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--accent-primary)]" style={{ fontFamily: 'Space Grotesk' }}>98%</p>
                <p className="text-sm text-[var(--text-muted)]">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="mt-20 relative animate-fade-in stagger-5">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
            <div className="h-8 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Open Tickets', value: '24', color: 'from-blue-500 to-blue-600' },
                  { label: 'In Progress', value: '12', color: 'from-amber-500 to-orange-500' },
                  { label: 'Resolved Today', value: '48', color: 'from-emerald-500 to-green-500' },
                  { label: 'Avg Response', value: '2.4h', color: 'from-violet-500 to-purple-600' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[var(--bg-secondary)] rounded-xl p-4">
                    <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'Space Grotesk' }}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 bg-[var(--bg-secondary)] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
