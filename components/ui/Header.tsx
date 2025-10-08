import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-ios-bg/80 backdrop-blur-lg border-b border-brand-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
           <Logo height={30}/>
           <span className="text-xl font-bold text-gray-800">Vi.Ma</span>
        </div>
    </header>
  );
};
