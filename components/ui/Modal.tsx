
import React from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center" onClick={onClose}>
      <div 
        className="bg-ios-bg w-full max-w-md rounded-t-2xl shadow-xl p-4 transform transition-transform translate-y-full animate-[slide-up_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
        style={{ animationName: 'slide-up', animationDuration: '0.3s' }}
      >
        <div className="flex justify-between items-center pb-3 border-b border-brand-gray-200">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
