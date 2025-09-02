"use client";

import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    country: '',
  });

  const { login, register, isLoading, error, clearError } = useAuth();

  // Handle body scroll lock without affecting navbar
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let success = false;
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register({
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email,
        password: formData.password,
        phone: '', // Empty phone for now
        country: formData.country,
      });
    }

    if (success) {
      onClose();
      setFormData({
        email: '',
        password: '',
        country: '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    clearError();
    setFormData({
      email: '',
      password: '',
      country: '',
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }}
    >
      <div
        className="relative w-full max-w-md rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: '#FAF9F6',
          margin: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <h2 
            className="text-2xl font-bold"
            style={{ color: '#368581', fontFamily: 'Playfair Display' }}
          >
            {isLogin ? 'Welcome Back' : 'Join VeBlyss Global'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 transform active:scale-95 hover:shadow-md"
          >
            <X size={20} style={{ color: '#222' }} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm" style={{ fontFamily: 'Open Sans' }}>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field - Always visible for both login and signup */}
            <div className="w-full">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                style={{
                  fontFamily: 'Open Sans',
                  backgroundColor: 'white'
                }}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field - Always visible for both login and signup */}
            <div className="relative w-full">
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                style={{
                  fontFamily: 'Open Sans',
                  backgroundColor: 'white'
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300 transform active:scale-95"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Country Field - Only for signup */}
            {!isLogin && (
              <div className="w-full">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: '#222', fontFamily: 'Open Sans' }}
                >
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  style={{
                    fontFamily: 'Open Sans',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="ZA">South Africa</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="NL">Netherlands</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="JP">Japan</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-bold text-lg hover:bg-opacity-90 hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md transform active:scale-95 hover:-translate-y-1"
              style={{
                backgroundColor: '#368581',
                color: '#FAF9F6',
                fontFamily: 'Open Sans',
              }}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p style={{ color: '#222', fontFamily: 'Open Sans' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={switchMode}
                className="font-bold hover:underline hover:scale-105 transition-all duration-300 transform active:scale-95"
                style={{ color: '#368581', fontFamily: 'Open Sans' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-4 text-center">
              <button
                className="text-sm hover:underline hover:scale-105 transition-all duration-300 transform active:scale-95"
                style={{ color: '#368581', fontFamily: 'Open Sans' }}
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
