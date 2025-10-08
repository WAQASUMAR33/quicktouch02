'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAcademyData, logoutAcademy, getRoleDisplayName, getRoleColor, getNavigationItems } from '@/lib/academyAuth';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editData, setEditData] = useState({
    full_name: '',
    phone: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    position: '',
    preferred_foot: ''
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const academyData = getAcademyData();
    
    if (!academyData) {
      router.push('/academy/login');
      return;
    }

    setUser(academyData);
    loadProfile(academyData);
  }, [router]);

  const loadProfile = async (userData) => {
    try {
      setIsLoading(true);
      
      // For academy role, use academy data directly
      if (userData.role === 'academy') {
        const fallbackData = {
          academy_id: userData.academy_id,
          full_name: userData.name || userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          address: userData.address || '',
          description: userData.description || '',
          website: userData.website || '',
          role: 'academy',
          email_verified: userData.email_verified,
          is_active: userData.is_active,
          created_at: userData.created_at || new Date().toISOString(),
          player_profile: null
        };
        setProfileData(fallbackData);
        setEditData({
          full_name: fallbackData.full_name || '',
          phone: fallbackData.phone || '',
          age: '',
          height_cm: '',
          weight_kg: '',
          position: '',
          preferred_foot: ''
        });
        setIsLoading(false);
        return;
      }

      // For other roles, try to get user profile from API
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('academy_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data.user);
        setEditData({
          full_name: data.user.full_name || '',
          phone: data.user.phone || '',
          age: data.user.player_profile?.age || '',
          height_cm: data.user.player_profile?.height_cm || '',
          weight_kg: data.user.player_profile?.weight_kg || '',
          position: data.user.player_profile?.position || '',
          preferred_foot: data.user.player_profile?.preferred_foot || ''
        });
      } else {
        // Fallback to using data from localStorage if API fails
        console.warn('Profile API failed, using localStorage data');
        const fallbackData = {
          user_id: userData.userId,
          full_name: userData.fullName,
          email: userData.email,
          phone: userData.phone || '',
          role: userData.role,
          created_at: new Date().toISOString(),
          player_profile: userData.playerProfile || null
        };
        setProfileData(fallbackData);
        setEditData({
          full_name: fallbackData.full_name || '',
          phone: fallbackData.phone || '',
          age: fallbackData.player_profile?.age || '',
          height_cm: fallbackData.player_profile?.heightCm || '',
          weight_kg: fallbackData.player_profile?.weightKg || '',
          position: fallbackData.player_profile?.position || '',
          preferred_foot: fallbackData.player_profile?.preferredFoot || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Use localStorage data as last resort
      const fallbackData = {
        user_id: userData.userId,
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone || '',
        role: userData.role,
        created_at: new Date().toISOString()
      };
      setProfileData(fallbackData);
      setEditData({
        full_name: fallbackData.full_name || '',
        phone: fallbackData.phone || ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('academy_token')}`
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        await loadProfile(user);
        
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setIsChangingPassword(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('academy_token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Network error. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    logoutAcademy();
    router.push('/academy/login');
  };

  

  

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-white">QuickTouch</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-bold text-white">
                {user?.fullName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-yellow-500/20 text-yellow-400">
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {getNavigationItems(user?.role, '/academy/profile').map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  item.current
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <svg
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    item.current ? 'text-yellow-400' : 'text-gray-400 group-hover:text-white'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all duration-200"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <h2 className="text-xl font-bold text-white">My Profile</h2>
                <p className="text-xs text-gray-400">Manage your information</p>
              </div>

              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6 lg:p-8">
          {/* Profile Header */}
          <div className="mb-8 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className={`h-24 w-24 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center shadow-xl border-4 border-white/30`}>
                <span className="text-4xl font-bold text-white">
                  {user?.fullName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData?.full_name || user?.fullName}</h1>
                <p className="text-gray-800 text-lg mb-2">{profileData?.email || user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-gray-900/20 text-gray-900 border border-gray-900/30">
                    {getRoleDisplayName(user?.role)}
                  </span>
                  {profileData?.player_profile?.position && (
                    <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-900/30 text-blue-900 border border-blue-900/40">
                      {profileData.player_profile.position}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6 bg-green-900/30 border border-green-500/50 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-200 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Content */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="max-w-3xl">
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Edit Profile Information</h3>
                
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        value={editData.full_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>

                  {/* Player-specific fields */}
                  {user?.role === 'player' && (
                    <>
                      <div className="border-t border-gray-700 pt-4 mt-4">
                        <h4 className="text-lg font-semibold text-white mb-4">Player Information</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Age</label>
                          <input
                            type="number"
                            name="age"
                            value={editData.age}
                            onChange={handleInputChange}
                            min="5"
                            max="50"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter age"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Position</label>
                          <select
                            name="position"
                            value={editData.position}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="">Select position</option>
                            <option value="Goalkeeper">Goalkeeper</option>
                            <option value="Defender">Defender</option>
                            <option value="Midfielder">Midfielder</option>
                            <option value="Forward">Forward</option>
                            <option value="Winger">Winger</option>
                            <option value="Striker">Striker</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Height (cm)</label>
                          <input
                            type="number"
                            name="height_cm"
                            value={editData.height_cm}
                            onChange={handleInputChange}
                            min="100"
                            max="250"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter height in cm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Weight (kg)</label>
                          <input
                            type="number"
                            name="weight_kg"
                            value={editData.weight_kg}
                            onChange={handleInputChange}
                            min="20"
                            max="150"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter weight in kg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-200 mb-2">Preferred Foot</label>
                          <select
                            name="preferred_foot"
                            value={editData.preferred_foot}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          >
                            <option value="">Select preferred foot</option>
                            <option value="Left">Left</option>
                            <option value="Right">Right</option>
                            <option value="Both">Both</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="max-w-3xl space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-semibold text-white">{profileData?.email}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <p className="text-sm font-semibold text-white">{profileData?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {/* Player Stats */}
              {user?.role === 'player' && profileData?.player_profile && (
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">Player Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 text-center">
                      <p className="text-xs text-gray-400 mb-1">Age</p>
                      <p className="text-2xl font-bold text-white">{profileData.player_profile.age || '-'}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 text-center">
                      <p className="text-xs text-gray-400 mb-1">Height</p>
                      <p className="text-2xl font-bold text-white">{profileData.player_profile.height_cm || '-'}</p>
                      <p className="text-xs text-gray-400">cm</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 text-center">
                      <p className="text-xs text-gray-400 mb-1">Weight</p>
                      <p className="text-2xl font-bold text-white">{profileData.player_profile.weight_kg || '-'}</p>
                      <p className="text-xs text-gray-400">kg</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 text-center">
                      <p className="text-xs text-gray-400 mb-1">Foot</p>
                      <p className="text-lg font-bold text-white">{profileData.player_profile.preferred_foot || '-'}</p>
                    </div>
                  </div>
                  {profileData.player_profile.position && (
                    <div className="mt-4 bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Position</p>
                      <p className="text-lg font-semibold text-white">{profileData.player_profile.position}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Security Section */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Security</h3>
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Password</p>
                      <p className="text-xs text-gray-400">Last changed: Recently</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">User ID</p>
                    <p className="text-sm font-semibold text-white">#{profileData?.user_id || user?.userId}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Member Since</p>
                    <p className="text-sm font-semibold text-white">
                      {profileData?.created_at 
                        ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClosePasswordModal}></div>

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 z-10">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Change Password</h3>
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="px-6 py-6">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Current Password *</label>
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">New Password *</label>
                  <input
                    type="password"
                    name="newPassword"
                    required
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Confirm New Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-200 text-sm font-medium">{passwordSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {passwordError && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-200 text-sm font-medium">{passwordError}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleClosePasswordModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isChangingPassword ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

