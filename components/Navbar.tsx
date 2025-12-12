import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import Button from './Button';
import { ButtonVariant } from '../types';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || isOpen ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Hexagon className="h-8 w-8 text-techBlue fill-techBlue/10 animate-pulse mr-2" />
            <span className="font-heading font-bold text-xl tracking-tight text-techBlue">
              HexaCare<span className="text-navy">Intelligence</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-bodyText hover:text-techBlue font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Button 
              variant={ButtonVariant.PRIMARY} 
              className="px-6 py-2 text-sm"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy hover:text-techBlue focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full">
          <div className="px-4 pt-4 pb-8 space-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block font-sans text-navy hover:text-techBlue font-medium text-lg py-2 border-b border-gray-100"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4">
               <Button 
                variant={ButtonVariant.PRIMARY} 
                className="w-full"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;