import { 
  MessageSquare, 
  Zap, 
  Shield, 
  Clock, 
  BarChart3, 
  Users,
  Smartphone,
  Globe,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description: 'Communicate instantly with support staff through our live chat system. No more waiting for email replies.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Smart Routing',
    description: 'Tickets automatically assigned to the right specialist based on category and expertise.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with end-to-end encryption. Your data stays protected.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: Clock,
    title: 'Fast Response',
    description: 'Average response time under 2 hours. Critical issues handled within 15 minutes.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track ticket trends, response times, and team performance with detailed reports.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Internal notes, ticket sharing, and seamless handoffs between team members.',
    color: 'from-indigo-500 to-blue-500',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[var(--accent-primary)] font-semibold mb-4">FEATURES</p>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Everything you need for{' '}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              exceptional support
            </span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Powerful tools that help you deliver world-class technical support to your users.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-[var(--bg-card)] rounded-2xl p-6 lg:p-8 border border-[var(--border-color)] card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile & Global Banner */}
        <div className="mt-16 lg:mt-24 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-teal-600 to-teal-500 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
            <div className="hidden dark:block absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl" />
            <Smartphone className="w-12 h-12 mb-6 opacity-80 relative z-10" />
            <h3 className="text-2xl font-bold mb-3 relative z-10" style={{ fontFamily: 'Space Grotesk' }}>
              Mobile Ready
            </h3>
            <p className="text-white/80 relative z-10">
              Access your tickets and chat with support from anywhere. 
              Fully responsive design works on any device.
            </p>
          </div>
          <div className="bg-[var(--bg-card)] rounded-2xl p-8 lg:p-10 border border-[var(--border-color)]">
            <Globe className="w-12 h-12 mb-6 text-teal-600 dark:text-amber-400" />
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              24/7 Support
            </h3>
            <p className="text-[var(--text-secondary)]">
              Our global team ensures you get help whenever you need it, 
              no matter your timezone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

