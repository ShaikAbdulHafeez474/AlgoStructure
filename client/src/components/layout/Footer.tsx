import React from 'react';
import { FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm">© 2023 Algorithm Visualizer | For Educational Purposes</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaGithub size={16} />
          </a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaTwitter size={16} />
          </a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">
            <FaEnvelope size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
