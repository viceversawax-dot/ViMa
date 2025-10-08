
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseStyles = "w-full text-center py-3 rounded-lg font-semibold text-base focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50";
  
  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-blue-600 focus:ring-brand-blue',
    secondary: 'bg-brand-gray-200 text-brand-blue hover:bg-brand-gray-300 focus:ring-brand-blue',
    danger: 'bg-brand-red text-white hover:bg-red-600 focus:ring-brand-red',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
