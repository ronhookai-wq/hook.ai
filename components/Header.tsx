import React from 'react';
import { AndroidIcon } from './icons';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: 'generate' | 'upload' | 'pricing') => void;
  onSignInClick: () => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onSignInClick, isLoggedIn }) => {
  const NavLink: React.FC<{ page: 'generate' | 'upload' | 'pricing'; children: React.ReactNode }> = ({ page, children }) => (
    <button
      onClick={() => setActivePage(page)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        activePage === page
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-gray-700">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('generate')}>
              <img
                src="/Screenshot_2025-11-06_085859-removebg-preview (1).png"
                alt="Hook.ai Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold tracking-tighter">HOOK.AI</span>
            </div>
            <nav className="hidden md:flex items-center ml-10 space-x-4">
              <NavLink page="generate">Generate</NavLink>
              <NavLink page="upload">Upload & Edit</NavLink>
              <NavLink page="pricing">Pricing</NavLink>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={onSignInClick}
              className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-all transform hover:scale-105"
            >
              {isLoggedIn ? 'Sign Out' : 'Sign In / Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;