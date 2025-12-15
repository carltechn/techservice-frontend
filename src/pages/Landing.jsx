import { Navbar, Hero, Features, HowItWorks, Testimonials, CTA, Footer } from '../components/landing';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
