import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "TechService has transformed how we handle IT support. Response times went from days to hours. Our team is more productive than ever.",
    author: "Sarah Chen",
    role: "IT Director",
    company: "Innovate Corp",
    avatar: "SC",
    rating: 5,
  },
  {
    content: "The real-time chat feature is a game-changer. Being able to share screens and resolve issues live has saved us countless hours.",
    author: "Michael Roberts",
    role: "CTO",
    company: "StartupXYZ",
    avatar: "MR",
    rating: 5,
  },
  {
    content: "Finally, a support system that actually works. The interface is intuitive, and the team behind it truly cares about solving problems.",
    author: "Emily Johnson",
    role: "Operations Manager",
    company: "Growth Inc",
    avatar: "EJ",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[var(--accent-primary)] font-semibold mb-4">TESTIMONIALS</p>
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Loved by{' '}
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Don't just take our word for it. Here's what our customers say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[var(--bg-card)] rounded-2xl p-6 lg:p-8 border border-[var(--border-color)] card-hover"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {testimonial.role}, {testimonial.company}
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

export default Testimonials;

