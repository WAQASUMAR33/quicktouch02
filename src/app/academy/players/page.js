'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyPlayers() {
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterPosition, setFilterPosition] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('academy_token');
    const userData = localStorage.getItem('academy_user');
    
    if (!token || !userData) {
      router.push('/academy/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Only coaches can access this page
    if (parsedUser.role !== 'coach') {
      router.push('/academy/dashboard');
      return;
    }

    setUser(parsedUser);
    loadPlayers();
  }, [router]);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/players');
      
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players || []);
        setFilteredPlayers(data.players || []);
      }
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (position) => {
    setFilterPosition(position);
    if (position === 'all') {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(p => p.player_profile?.position === position));
    }
  };

  const handleViewDetails = (player) => {
    setSelectedPlayer(player);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPlayer(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('academy_token');
    localStorage.removeItem('academy_user');
    router.push('/academy/login');
  };

  const getRoleColor = () => {
    return 'from-blue-500 to-blue-600';
  };

  const getNavigationItems = () => {
    return [
      { name: 'Dashboard', href: '/academy/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', current: false },
      { name: 'Events', href: '/academy/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', current: false },
      { name: 'Training Plans', href: '/academy/training-plans', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', current: false },
      { name: 'My Players', href: '/academy/players', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', current: true },
      { name: 'Feedback', href: '/academy/feedback', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', current: false }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading players...</p>
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
            <div className={`h-12 w-12 bg-gradient-to-br ${getRoleColor()} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-bold text-white">
                {user?.fullName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-yellow-500/20 text-yellow-400">
                Coach
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {getNavigationItems().map((item) => (
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
                <h2 className="text-xl font-bold text-white">My Players</h2>
                <p className="text-xs text-gray-400">Manage your players</p>
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
          {/* Modern Header Banner */}
          <div className="mb-8 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">My Players</h3>
                </div>
                <p className="text-gray-800 text-lg font-medium">
                  Managing {filteredPlayers.length} talented athletes
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-800 font-medium">Active Players</span>
                  </div>
                  <div className="text-sm text-gray-800">
                    Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterPosition === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('Goalkeeper')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterPosition === 'Goalkeeper' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Goalkeeper
            </button>
            <button
              onClick={() => handleFilterChange('Defender')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterPosition === 'Defender' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Defender
            </button>
            <button
              onClick={() => handleFilterChange('Midfielder')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterPosition === 'Midfielder' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Midfielder
            </button>
            <button
              onClick={() => handleFilterChange('Forward')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterPosition === 'Forward' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Forward
            </button>
          </div>

          {filteredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <div
                  key={player.user_id}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-14 w-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {player.full_name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{player.full_name}</h4>
                        {player.player_profile?.position && (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {player.player_profile.position}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {player.email}
                    </div>
                    {player.phone && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {player.phone}
                      </div>
                    )}
                  </div>

                  {player.player_profile && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {player.player_profile.age && (
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-400">Age</p>
                          <p className="text-sm font-semibold text-white">{player.player_profile.age}</p>
                        </div>
                      )}
                      {player.player_profile.height_cm && (
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-400">Height</p>
                          <p className="text-sm font-semibold text-white">{player.player_profile.height_cm}cm</p>
                        </div>
                      )}
                      {player.player_profile.weight_kg && (
                        <div className="bg-gray-700/30 rounded-lg p-2 text-center">
                          <p className="text-xs text-gray-400">Weight</p>
                          <p className="text-sm font-semibold text-white">{player.player_profile.weight_kg}kg</p>
                        </div>
                      )}
                    </div>
                  )}

                  <button 
                    onClick={() => handleViewDetails(player)}
                    className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 border border-gray-700/50 text-center">
              <svg className="h-20 w-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Players Found</h3>
              <p className="text-gray-400">
                {filterPosition === 'all' ? 'No players available' : `No ${filterPosition} players found.`}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Player Details Modal */}
      {showDetailsModal && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseDetails}></div>

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Player Profile</h3>
                <button type="button" onClick={handleCloseDetails}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-bold text-white">
                      {selectedPlayer.full_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedPlayer.full_name}</h2>
                    {selectedPlayer.player_profile?.position && (
                      <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {selectedPlayer.player_profile.position}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-sm font-semibold text-white">{selectedPlayer.email}</p>
                  </div>
                  {selectedPlayer.phone && (
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Phone</p>
                      <p className="text-sm font-semibold text-white">{selectedPlayer.phone}</p>
                    </div>
                  )}
                </div>

                {selectedPlayer.player_profile && (
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Physical Stats</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedPlayer.player_profile.age && (
                        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">Age</p>
                          <p className="text-2xl font-bold text-white">{selectedPlayer.player_profile.age}</p>
                        </div>
                      )}
                      {selectedPlayer.player_profile.height_cm && (
                        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">Height</p>
                          <p className="text-2xl font-bold text-white">{selectedPlayer.player_profile.height_cm}</p>
                          <p className="text-xs text-gray-400">cm</p>
                        </div>
                      )}
                      {selectedPlayer.player_profile.weight_kg && (
                        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">Weight</p>
                          <p className="text-2xl font-bold text-white">{selectedPlayer.player_profile.weight_kg}</p>
                          <p className="text-xs text-gray-400">kg</p>
                        </div>
                      )}
                      {selectedPlayer.player_profile.preferred_foot && (
                        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 mb-1">Foot</p>
                          <p className="text-lg font-bold text-white">{selectedPlayer.player_profile.preferred_foot}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700">
              <button onClick={handleCloseDetails}
                className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

