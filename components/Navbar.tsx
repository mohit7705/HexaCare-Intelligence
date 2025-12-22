import React, { useState, useEffect } from 'react';
import { Hexagon, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import Button from './Button';
import { ButtonVariant } from '../types';

interface NavbarProps {
  onAuthClick: () => void;
  user?: any;              // ✅ added
  onLogout?: () => void;   // ✅ added
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick, user, onLogout }) => {
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
    onAuthClick();
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0
        z-[9999]
        w-full
        transition-all duration-300
        ${scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' 
          : 'bg-transparent py-4'}
      `}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center h-16 lg:h-20">

          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Hexagon className="h-8 w-8 lg:h-10 lg:w-10 text-[#0070f3] fill-[#0070f3]/10 mr-3" />
            <span className="font-heading font-black text-xl lg:text-2xl text-[#001e3c] uppercase tracking-tighter">
              HexaCare <span className="text-[#0070f3]">Intelligence</span>
            </span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans font-bold text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#001e3c] hover:text-[#0070f3] transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* ✅ AUTH-AWARE BUTTONS (added, not replaced) */}
            {user ? (
              <>
                <a
                  href="/dashboard"
                  className="font-sans font-bold text-[11px] lg:text-xs uppercase tracking-[0.2em] text-[#001e3c] hover:text-[#0070f3]"
                >
                  Dashboard
                </a>

                <Button
                  variant={ButtonVariant.PRIMARY}
                  className="px-6 py-2.5 lg:px-8 lg:py-3 text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-full bg-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant={ButtonVariant.PRIMARY}
                className="px-6 py-2.5 lg:px-8 lg:py-3 text-[10px] lg:text-xs font-black uppercase tracking-widest rounded-full bg-[#0070f3]"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#001e3c]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-8 space-y-6 shadow-xl animate-in slide-in-from-top duration-300">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-[#001e3c] font-bold text-sm uppercase tracking-[0.2em]"
            >
              {item.label}
            </a>
          ))}

          {/* ✅ MOBILE AUTH-AWARE BUTTONS */}
          {user ? (
            <>
              <a
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-[#001e3c] font-bold text-sm uppercase tracking-[0.2em]"
              >
                Dashboard
              </a>

              <Button
                variant={ButtonVariant.PRIMARY}
                className="w-full py-4 rounded-xl bg-red-500"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant={ButtonVariant.PRIMARY}
              className="w-full py-4 rounded-xl bg-[#0070f3]"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
