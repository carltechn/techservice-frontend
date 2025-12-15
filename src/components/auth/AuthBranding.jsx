import { Wrench } from 'lucide-react';

const AuthBranding = ({ title, subtitle, side = 'left' }) => {
  const features = [
    { emoji: '⚡', text: 'Fast response times' },
    { emoji: '💬', text: 'Real-time chat support' },
    { emoji: '🛡️', text: 'Expert technicians' },
  ];

  return (
    <div className={`hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden ${side === 'right' ? 'order-last' : ''}`}>
      {/* Light mode: teal gradient, Dark mode: deep slate gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-500 dark:from-slate-900 dark:to-slate-800" />
      
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 border border-white/30 rounded-full" />
        <div className="absolute top-40 left-40 w-96 h-96 border border-white/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-64 h-64 border border-white/30 rounded-full" />
        {/* Subtle amber glow in dark mode */}
        <div className="hidden dark:block absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/20 dark:bg-amber-500/20 backdrop-blur flex items-center justify-center mb-8 animate-fade-in">
          <Wrench className="w-8 h-8 dark:text-amber-400" />
        </div>
        
        <h1 
          className="text-5xl xl:text-6xl font-bold mb-6 animate-fade-in stagger-1" 
          style={{ fontFamily: 'Space Grotesk' }}
        >
          {title}
        </h1>
        
        <p className="text-xl xl:text-2xl text-white/80 max-w-md animate-fade-in stagger-2">
          {subtitle}
        </p>

        <div className="mt-12 space-y-4 animate-fade-in stagger-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 dark:bg-amber-500/20 flex items-center justify-center">
                <span className="text-lg">{feature.emoji}</span>
              </div>
              <span className="text-lg">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;
