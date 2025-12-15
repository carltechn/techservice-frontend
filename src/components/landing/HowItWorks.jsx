import { FileText, Users, MessageCircle, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Submit a Ticket',
    description: 'Describe your issue with details about the problem. Attach screenshots or files if needed.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Get Assigned',
    description: 'Our smart system routes your ticket to the best available specialist for your issue type.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Chat & Collaborate',
    description: 'Communicate in real-time with your assigned technician. Share screens, files, and more.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Issue Resolved',
    description: 'Once fixed, we document the solution for your reference and close the ticket.',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[var(--accent-primary)] font-semibold mb-4">HOW IT WORKS</p>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Get help in{' '}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              4 simple steps
            </span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            From problem to solution in minutes, not days.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-[var(--border-color)] -translate-x-1/2" />
              )}
              
              <div className="relative bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] card-hover">
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-sm font-bold">
                  {step.number}
                </div>
                
                <div className="pt-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

