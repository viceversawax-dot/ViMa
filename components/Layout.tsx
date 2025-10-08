import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { ProductList } from './ProductList';
import { Scanner } from './Scanner';
import { Icon } from './ui/Icon';
import { Header } from './ui/Header';

type View = 'dashboard' | 'inventory' | 'scan';
type IconName = 'dashboard' | 'home' | 'qr-code';

const NavItem: React.FC<{
  label: string;
  iconName: IconName;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, iconName, isActive, onClick }) => {
  const activeColor = 'text-brand-blue';
  const inactiveColor = 'text-brand-gray-500';
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full pt-2 pb-1 focus:outline-none"
    >
      <Icon name={iconName} className={`w-6 h-6 mb-1 transition-colors ${isActive ? activeColor : inactiveColor}`} />
      <span className={`text-xs font-medium transition-colors ${isActive ? activeColor : inactiveColor}`}>{label}</span>
    </button>
  );
};

const Layout: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <ProductList />;
      case 'scan':
        return <Scanner />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-ios-bg flex flex-col font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-ios-secondary-bg/80 backdrop-blur-lg border-t border-brand-gray-300">
        <nav className="flex justify-around items-center h-full max-w-md mx-auto">
          <NavItem label="Riepilogo" iconName="dashboard" isActive={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
          <NavItem label="Inventario" iconName="home" isActive={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} />
          <NavItem label="Scansiona" iconName="qr-code" isActive={currentView === 'scan'} onClick={() => setCurrentView('scan')} />
        </nav>
      </footer>
    </div>
  );
};

export default Layout;
