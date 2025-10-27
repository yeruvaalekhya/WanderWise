import React from 'react';
import type { View } from '../App';
import { MapPinIcon } from './icons/MapPinIcon';
import { CameraIcon } from './icons/CameraIcon';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const NavButton: React.FC<{
    viewName: View;
    label: string;
    icon: React.ReactNode;
  }> = ({ viewName, label, icon }) => {
    const isActive = currentView === viewName;
    return (
      <button
        onClick={() => setView(viewName)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              WanderWise
            </h1>
          </div>
          <nav className="flex items-center gap-2 p-1 bg-gray-200 rounded-full">
            <NavButton
              viewName="explore"
              label="Explore"
              icon={<MapPinIcon className="w-5 h-5" />}
            />
            <NavButton
              viewName="editor"
              label="Photo Editor"
              icon={<CameraIcon className="w-5 h-5" />}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
