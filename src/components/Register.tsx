"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { register, isLoading } = useAuth();

  const validateField = (name: string, value: string) => {
    let err = '';
    if (name === 'email') {
      if (!/\S+@\S+\.\S+/.test(value)) err = 'Invalid email format';
    }
    if (name === 'password') {
      if (value.length < 8) err = 'Password must be at least 8 characters';
      else if (!/\d/.test(value)) err = 'Password must contain a number';
      else if (!/[A-Z]/.test(value)) err = 'Password must contain an uppercase letter';
    }
    if (name === 'confirmPassword') {
      if (value !== password) err = 'Passwords do not match';
    }
    if (name === 'phone') {
      if (value.length < 10) err = 'Phone must be at least 10 digits';
      else if (!/^\+?[1-9]\d{1,14}$/.test(value)) err = 'Invalid phone format (e.g., +1234567890)';
    }
    return err;
  };

  const handleChange = (name: string, value: string) => {
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    if (name === 'phone') setPhone(value);
    if (name === 'role') setRole(value as 'buyer' | 'seller' | 'admin');

    const err = validateField(name, value);
    setClientErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Final client-side check
    const passwordErr = validateField('password', password);
    const confirmErr = validateField('confirmPassword', confirmPassword);
    const phoneErr = validateField('phone', phone);
    const emailErr = validateField('email', email);

    if (passwordErr || confirmErr || phoneErr || emailErr) {
      setClientErrors({ password: passwordErr, confirmPassword: confirmErr, phone: phoneErr, email: emailErr });
      return;
    }

    const success = await register(email, password, phone, role);
    if (success) {
      setFeedback({ type: 'success', message: 'Registration successful!' });
      setTimeout(() => {
        onClose();
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: 'Registration failed. Please check your inputs.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center font-poppins z-50">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Register</h2>
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
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
            {clientErrors.email && <p className="text-red-500 text-xs mt-1">{clientErrors.email}</p>}
            <p className="text-gray-500 text-xs mt-1">Enter a valid email (e.g., user@example.com)</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {clientErrors.password && <p className="text-red-500 text-xs mt-1">{clientErrors.password}</p>}
            <p className="text-gray-500 text-xs mt-1">At least 8 chars, 1 number, 1 uppercase</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {clientErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{clientErrors.confirmPassword}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
              required
            />
            {clientErrors.phone && <p className="text-red-500 text-xs mt-1">{clientErrors.phone}</p>}
            <p className="text-gray-500 text-xs mt-1">International format, 10-15 digits (e.g., +1234567890)</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-gray-500 text-xs mt-1">Select your account type</p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white dark:text-gray-100 py-2 px-4 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-200 text-sm sm:text-base flex items-center justify-center"
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
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Login
          </button>
        </p>
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

export default Register;