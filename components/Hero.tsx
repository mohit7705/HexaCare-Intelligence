// components/Hero.tsx
import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import Button from './Button';
import Hero3DBackground from './Hero3DBackground'; // <--- 1. Import the new component

const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* 2. Add the 3D Background here. It has `absolute` and `-z-10` styles
          inside it, so it will sit behind everything else. */}
      <Hero3DBackground />

      <div className="container mx-auto px-4 relative z-10"> {/* z-10 keeps text on top */}
        <div className="max-w-4xl mx-auto text-center">
          {/* A new "New Feature" badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in-up">
            <Activity className="w-4 h-4 text-techBlue" />
            <span className="text-sm font-medium text-navy">
              Now powered by Next-Gen Neural Engines
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-navy mb-8 tracking-tight leading-tight animate-fade-in-up decoration-slice">
            Reinventing <span className="text-transparent bg-clip-text bg-gradient-to-r from-techBlue to-skyGlow">Early Health Screening</span> with AI + Blockchain
          </h1>
          
          <p className="text-xl text-slateBlue mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            HexaCare Intelligence is a next-generation 6-in-1 health screening 
            platform powered by LLMs, ML, Vision AI, and Stellar blockchain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Button 
              variant="primary" 
              size="lg" 
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() => scrollTo('contact')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollTo('features')}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </div>
      
      {/* We removed the old <img> tag from down here */}
    </section>
  );
};

export default Hero;