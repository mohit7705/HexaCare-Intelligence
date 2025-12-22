import React from 'react';
import { ButtonVariant } from '../types'; // Updated path since you have no src folder

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = ButtonVariant.PRIMARY, 
  children, 
  className = '', 
  ...props 
}) => {
  // Base styles: removed fixed px/py so you can override them in Hero vs Navbar
  const baseStyles = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 transform active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyles = "";
  
  switch (variant) {
    case ButtonVariant.PRIMARY:
      // This matches the vibrant blue and shadow glow from your first image
      variantStyles = "bg-[#0070f3] text-white shadow-[0_10px_30px_rgba(0,112,243,0.3)] hover:shadow-[0_15px_40px_rgba(0,112,243,0.4)] hover:-translate-y-1";
      break;
    case ButtonVariant.SECONDARY:
      // A slightly softer navy/dark blue variant
      variantStyles = "bg-[#001e3c] text-white hover:bg-[#001e3c]/90 shadow-md";
      break;
    case ButtonVariant.OUTLINE:
      variantStyles = "bg-transparent border-2 border-[#0070f3] text-[#0070f3] hover:bg-[#0070f3] hover:text-white";
      break;
    case ButtonVariant.GHOST:
      variantStyles = "bg-transparent text-[#001e3c] hover:bg-gray-100";
      break;
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;