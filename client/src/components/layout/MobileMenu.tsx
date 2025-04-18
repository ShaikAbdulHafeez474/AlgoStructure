import React from 'react';
import { Link } from 'wouter';
import { FaMoon } from 'react-icons/fa';

interface MobileMenuProps {
  toggleMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ toggleMobileMenu }) => {
  const toggleDarkMode = () => {
    // Dark mode functionality to be implemented
    console.log('Toggle dark mode');
  };

  return (
    <div className="md:hidden bg-surface shadow-md z-10">
      <div className="container mx-auto px-4 py-2">
        <nav className="flex flex-col space-y-2">
          <Link 
            href="#" 
            className="px-3 py-2 hover:bg-background rounded"
            onClick={toggleMobileMenu}
          >
            Documentation
          </Link>
          <Link 
            href="#" 
            className="px-3 py-2 hover:bg-background rounded"
            onClick={toggleMobileMenu}
          >
            GitHub
          </Link>
          <button 
            className="px-3 py-2 text-left hover:bg-background rounded flex items-center"
            onClick={toggleDarkMode}
          >
            <FaMoon className="mr-2" /> Dark Mode
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
