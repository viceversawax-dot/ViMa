import React from 'react';

interface LogoProps {
  className?: string;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, height = 35 }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 35 35" height={height} xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M17.5 2.5 L32.5 10 L32.5 25 L17.5 32.5 L2.5 25 L2.5 10 Z" fill="#E5E5EA" stroke="#AEAEB2" strokeWidth="1.5"/>
          <path d="M17.5 2.5 L32.5 10 L17.5 17.5 L2.5 10 Z" fill="#FFFFFF" stroke="#AEAEB2" strokeWidth="1.5"/>
          <path d="M2.5 10 L2.5 25 L17.5 32.5 L17.5 17.5 Z" fill="#F2F2F7" stroke="#AEAEB2" strokeWidth="1.5"/>
        </g>
      </svg>
    </div>
  );
};
