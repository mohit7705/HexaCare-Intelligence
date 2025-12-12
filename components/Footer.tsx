import React from 'react';
import { Hexagon } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          
          <div className="flex items-center mb-4 md:mb-0">
            <Hexagon className="h-6 w-6 text-techBlue fill-techBlue/10 mr-2" />
            <span className="font-heading font-bold text-lg text-white">
              HexaCare Intelligence
            </span>
          </div>

          <div className="flex space-x-6">
            {['Privacy Policy', 'Terms of Service', 'Compliance'].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-skyGlow text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center md:text-left">
          <p className="text-gray-500 text-sm font-sans">
            &copy; 2025 HexaCare Intelligence | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;