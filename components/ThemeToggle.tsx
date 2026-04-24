
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from './Icons';

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:rotate-12 hover:scale-110 ${
        theme === 'dark' 
          ? 'bg-slate-800 text-yellow-300 hover:bg-slate-700' 
          : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-purple-600 border border-gray-200'
      } ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
