import React from 'react';
import { ButtonVariant } from '../types';

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
  const baseStyles = "px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  let variantStyles = "";
  
  switch (variant) {
    case ButtonVariant.PRIMARY:
      variantStyles = "bg-gradient-primary text-white shadow-lg hover:shadow-xl focus:ring-techBlue";
      break;
    case ButtonVariant.OUTLINE:
      variantStyles = "bg-transparent border-2 border-techBlue text-techBlue hover:bg-techBlue hover:text-white focus:ring-techBlue";
      break;
    case ButtonVariant.GHOST:
      variantStyles = "bg-transparent text-techBlue hover:bg-pale";
      break;
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;