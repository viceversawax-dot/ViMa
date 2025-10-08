
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  const clickableStyles = onClick ? 'cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5' : '';
  return (
    <div
      className={`bg-ios-secondary-bg rounded-xl shadow-sm p-4 ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
