import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { ButtonVariant } from '../types';
import { Hexagon, ShieldCheck, ChevronDown } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  user: any;
}

const Hero: React.FC<HeroProps> = ({ onStart, user }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      onStart();
    }
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

          {/* BRAND */}
          <div className="mb-10 animate-in fade-in zoom-in duration-1000">
            <div className="flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <Hexagon className="h-16 w-16 text-[#0070f3] fill-[#0070f3]/10" />
              <span className="font-bold text-xl tracking-[0.15em] text-[#001e3c] uppercase">
                HexaCare <span className="text-[#0070f3]">Intelligence</span>
              </span>
            </div>
          </div>

          {/* HEADLINE */}
          <h1 className="text-6xl lg:text-8xl font-black text-[#001e3c] mb-6 tracking-tighter leading-tight animate-in slide-in-from-bottom-8 duration-1000">
            Reinventing <br />
            Health Screening
          </h1>

          <p className="text-xl lg:text-2xl text-navy/70 font-medium mb-12 max-w-2xl animate-in fade-in duration-1000 delay-300">
            Detect health risks early using AI — before symptoms become serious.
          </p>

          {/* CTA */}
          <div className="animate-in fade-in duration-1000 delay-500 flex flex-col items-center gap-8">
            <Button
              variant={ButtonVariant.PRIMARY}
              className="px-16 py-6 text-xl font-black uppercase tracking-[0.2em] rounded-full shadow-[0_20px_50px_rgba(0,112,243,0.3)] hover:scale-105 transition-all duration-300 bg-[#0070f3]"
              onClick={handleStart}
            >
              Start Free Health Screening
            </Button>

            {/* TRUST BADGE */}
            <div className="flex items-center gap-2 text-[#001e3c]/70 font-bold text-sm uppercase tracking-widest bg-white/40 px-6 py-2 rounded-full backdrop-blur-sm">
              <ShieldCheck size={18} className="text-[#0070f3]" />
              🔒 Privacy-first • AI-powered • Blockchain-secured reports
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity duration-500">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001e3c]">
          Explore how HexaCare works
        </span>
        <div className="relative w-[2px] h-14 bg-gray-200 overflow-hidden rounded-full">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[#0070f3] animate-bounce"></div>
        </div>
        <ChevronDown size={16} className="text-[#0070f3] animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
