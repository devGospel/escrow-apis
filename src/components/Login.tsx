
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onSwitchToRegister, onLoginSuccess }) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const success = await login(email, password);
    if (success) {
      setFeedback({ type: 'success', message: 'Login successful!' });
      onLoginSuccess(); // Trigger refresh in parent component
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: error || 'Login failed' });
    }
  };

  useEffect(() => {
    if (error) {
      setFeedback({ type: 'error', message: error });
    }
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins z-50">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md relative">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Login</h2>
        {feedback && (
          <div
            className={`mb-4 p-2 text-sm rounded-md ${
              feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {feedback.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 text-sm sm:text-base disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <button
          onClick={onSwitchToRegister}
          className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
        >
          Don&apos;t have an account? Register
        </button>
        <button
          onClick={onClose}
          className="mt-2 text-gray-600 dark:text-gray-400 hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;
