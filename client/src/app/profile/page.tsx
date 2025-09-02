"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Edit2, Save, X, User, Mail, Phone, Building, Globe } from 'lucide-react';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      company: user.company || '',
      country: user.country || '',
    });
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        // You might want to refresh the user context here
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      company: user?.company || '',
      country: user?.country || '',
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFECE0' }}>
        <div className="text-center">
          <p style={{ color: '#222', fontFamily: 'Open Sans' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-32 pb-16" style={{ backgroundColor: '#FFECE0' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div 
          className="rounded-xl shadow-lg p-8 mb-8"
          style={{ backgroundColor: '#FAF9F6' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#368581' }}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={48} style={{ color: '#FAF9F6' }} />
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: '#368581', fontFamily: 'Playfair Display' }}
              >
                {user.name}
              </h1>
              <p 
                className="text-lg mb-4"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                {user.email}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 hover:scale-105 hover:shadow-xl transition-all duration-300 transform active:scale-95 hover:-translate-y-1"
                  style={{
                    backgroundColor: '#368581',
                    color: '#FAF9F6',
                    fontFamily: 'Open Sans',
                  }}
                >
                  <Edit2 size={20} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 hover:bg-opacity-10 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:-translate-y-1"
                  style={{
                    borderColor: '#368581',
                    color: '#368581',
                    fontFamily: 'Open Sans',
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div 
          className="rounded-xl shadow-lg p-8"
          style={{ backgroundColor: '#FAF9F6' }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 
              className="text-2xl font-bold"
              style={{ color: '#368581', fontFamily: 'Playfair Display' }}
            >
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md transform active:scale-95"
              >
                <Edit2 size={20} style={{ color: '#368581' }} />
              </button>
            )}
          </div>

          {message && (
            <div 
              className={`mb-6 p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-green-100 border border-green-300' 
                  : 'bg-red-100 border border-red-300'
              }`}
            >
              <p 
                className={`${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}
                style={{ fontFamily: 'Open Sans' }}
              >
                {message.text}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label 
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                <User size={16} />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  style={{
                    fontFamily: 'Open Sans'
                  }}
                />
              ) : (
                <p 
                  className="px-4 py-3 bg-gray-50 rounded-xl"
                  style={{ color: '#222', fontFamily: 'Open Sans' }}
                >
                  {user.name || 'Not provided'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label 
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                <Mail size={16} />
                Email Address
              </label>
              <p 
                className="px-4 py-3 bg-gray-50 rounded-xl"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                {user.email}
              </p>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Open Sans' }}>
                  Email cannot be changed
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label 
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                <Phone size={16} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  style={{
                    fontFamily: 'Open Sans'
                  }}
                  placeholder="Enter phone number"
                />
              ) : (
                <p 
                  className="px-4 py-3 bg-gray-50 rounded-xl"
                  style={{ color: '#222', fontFamily: 'Open Sans' }}
                >
                  {user.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label 
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                <Building size={16} />
                Company
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  style={{
                    fontFamily: 'Open Sans'
                  }}
                  placeholder="Enter company name"
                />
              ) : (
                <p 
                  className="px-4 py-3 bg-gray-50 rounded-xl"
                  style={{ color: '#222', fontFamily: 'Open Sans' }}
                >
                  {user.company || 'Not provided'}
                </p>
              )}
            </div>

            {/* Country */}
            <div className="md:col-span-2">
              <label 
                className="flex items-center gap-2 text-sm font-semibold mb-3"
                style={{ color: '#222', fontFamily: 'Open Sans' }}
              >
                <Globe size={16} />
                Country
              </label>
              {isEditing ? (
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  style={{
                    fontFamily: 'Open Sans'
                  }}
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                  <option value="CA">Canada</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <p 
                  className="px-4 py-3 bg-gray-50 rounded-xl"
                  style={{ color: '#222', fontFamily: 'Open Sans' }}
                >
                  {user.country || 'Not provided'}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none transform active:scale-95 hover:-translate-y-1"
                style={{
                  backgroundColor: '#368581',
                  color: '#FAF9F6',
                  fontFamily: 'Open Sans',
                }}
              >
                <Save size={20} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 hover:bg-opacity-10 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95 hover:-translate-y-1"
                style={{
                  borderColor: '#368581',
                  color: '#368581',
                  fontFamily: 'Open Sans',
                }}
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
