import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui';

const CTA = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background - Light mode: teal gradient, Dark mode: deep purple/blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-500 dark:from-slate-900 dark:to-slate-800" />
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white/30 rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/20 rounded-full" />
        {/* Add subtle glow in dark mode */}
        <div className="hidden dark:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 dark:bg-amber-500/20 text-sm font-medium mb-8 dark:text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span>100% Free Forever</span>
        </div>

        <h2 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          Ready to get the support you deserve?
        </h2>
        
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Join thousands of users who trust TechService for their technical support needs. 
          No credit card required, no hidden fees.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button 
              size="lg" 
              variant="custom"
              icon={ArrowRight} 
              iconPosition="right"
              className="bg-white text-teal-600 hover:bg-gray-100 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 shadow-lg"
            >
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              size="lg" 
              variant="custom"
              className="text-white border-2 border-white/30 hover:bg-white/10"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/60">
          No signup fees • No monthly charges • Free forever
        </p>
      </div>
    </section>
  );
};

export default CTA;
