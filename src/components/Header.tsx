"use client";

import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout: () => void;
  onLoginSuccess: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onLogout, onLoginSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="bg-indigo-600 dark:bg-gray-900 text-white dark:text-gray-100 py-4 px-4 sm:px-6 lg:px-8 font-poppins shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 w-10 h-10 flex items-center justify-center rounded-full text-2xl font-bold">
            J
          </div>
          <h1 className="text-2xl font-semibold">JetStores</h1>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          className="lg:hidden text-white dark:text-gray-100"
          onClick={() => {
            setIsNavOpen(!isNavOpen);
            onToggleSidebar();
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className={`lg:flex lg:space-x-6 ${isNavOpen ? 'block' : 'hidden'} absolute lg:static top-16 left-0 right-0 bg-indigo-600 dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent p-4 lg:p-0`}>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
            <a href="#" className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200">Home</a>
            <a href="#" className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200">Shop</a>
            <a href="#" className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200">About</a>
            <a href="#" className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200">Contact</a>
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200 text-left"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="hover:text-indigo-200 dark:hover:text-indigo-400 transition duration-200 text-left"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onLoginSuccess={onLoginSuccess}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </header>
  );
};

export default Header;