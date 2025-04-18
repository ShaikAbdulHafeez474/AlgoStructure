import React from 'react';
import { Button } from '@/components/ui/button';
import { FaMoon, FaBars } from 'react-icons/fa';
import { ChartGantt } from 'lucide-react';
import { Link } from 'wouter';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const toggleDarkMode = () => {
    // Dark mode functionality to be implemented
    console.log('Toggle dark mode');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <ChartGantt className="text-2xl mr-3" />
          <h1 className="text-xl font-semibold">Algorithm Visualizer</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="px-3 py-1 rounded hover:bg-primary-dark transition-colors text-white"
            onClick={toggleDarkMode}
          >
            <FaMoon />
          </Button>
          <Link href="#" className="px-3 py-1 rounded hover:bg-primary-dark transition-colors">
            Documentation
          </Link>
          <Link href="#" className="px-3 py-1 rounded hover:bg-primary-dark transition-colors">
            GitHub
          </Link>
        </div>
        <Button 
          variant="ghost" 
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          <FaBars />
        </Button>
      </div>
    </header>
  );
};

export default Header;
