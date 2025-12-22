import React from 'react';
import { Link } from 'react-router-dom';
import { Hexagon, Mail, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy w-full pt-20 pb-10 border-t border-white/5">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
            <Hexagon className="h-10 w-10 text-techBlue fill-techBlue/10 mr-2" />
            <span className="font-heading font-bold text-2xl text-white">
              HexaCare Intelligence
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-2">
            <a
              href="mailto:hexacareintelligence@gmail.com"
              aria-label="Email"
              className="text-gray-400 hover:text-techBlue transition-all hover:scale-110"
            >
              <Mail size={20} />
            </a>

            <a
              href="https://www.linkedin.com/in/hexacare-intelligence-a0a9243a0/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-techBlue transition-all hover:scale-110"
            >
              <Linkedin size={20} />
            </a>

            <a
              href="https://x.com/HexacareI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-gray-400 hover:text-techBlue transition-all hover:scale-110"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <Link
            to="/privacy-policy"
            className="text-gray-400 hover:text-skyGlow text-sm transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-gray-400 hover:text-skyGlow text-sm transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/compliance"
            className="text-gray-400 hover:text-skyGlow text-sm transition-colors"
          >
            Compliance
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-gray-500 text-sm">
            © 2025 HexaCare Intelligence | All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
