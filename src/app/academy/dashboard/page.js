'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAcademyData, logoutAcademy, getRoleDisplayName, getRoleColor, getNavigationItems } from '@/lib/academyAuth';

export default function AcademyDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalPlayers: 0,
    myActivities: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const academyData = getAcademyData();
    
    if (!academyData) {
      router.push('/academy/login');
      return;
    }

    setUser(academyData);
  }, [router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load events data
      const eventsResponse = await fetch('/api/admin/events-simple');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setRecentEvents(eventsData.events.slice(0, 5));
        setStats(prev => ({ 
          ...prev, 
          totalEvents: eventsData.events.length,
          upcomingEvents: eventsData.events.filter(e => new Date(e.event_date) > new Date()).length
        }));
      }

      // Load real players data
      const playersResponse = await fetch('/api/players');
      if (playersResponse.ok) {
        const playersData = await playersResponse.json();
        const totalPlayers = playersData.players?.length || 0;
        setStats(prev => ({
          ...prev,
          totalPlayers: totalPlayers
        }));
      }

      // Load training plans data (for coaches)
      if (user?.role === 'coach') {
        const plansResponse = await fetch('/api/coach/training-plans');
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          const myActivities = plansData.training_plans?.length || 0;
          setStats(prev => ({
            ...prev,
            myActivities: myActivities
          }));
        }
      } else {
        // For players and scouts, use events count as activities
        setStats(prev => ({
          ...prev,
          myActivities: prev.upcomingEvents
        }));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        {/* Sidebar Header */}
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

        {/* User Info */}
        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-bold text-white">
                {user?.fullName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.email}
              </p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-yellow-500/20 text-yellow-400">
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {getNavigationItems(user?.role, '/academy/dashboard').map((item) => (
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

        {/* Logout Button */}
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

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Navigation Bar */}
        <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div>
                <h2 className="text-xl font-bold text-white">Dashboard</h2>
                <p className="text-xs text-gray-400">Academy Overview</p>
              </div>

              {/* Right Side - Date/Time */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.fullName}! 👋
                </h2>
              </div>
              <p className="text-gray-800 text-lg font-medium mb-4">
                Here&apos;s your academy overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-800 font-medium">Live Dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-800 font-medium">
                    Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Events</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalEvents}</p>
                <p className="text-green-400 text-xs mt-2">↑ Active</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-xl">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Upcoming</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.upcomingEvents}</p>
                <p className="text-yellow-400 text-xs mt-2">This week</p>
              </div>
              <div className="p-3 bg-yellow-600 rounded-xl">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Players/Activities */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  {user?.role === 'coach' ? 'My Players' : 'Activities'}
                </p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalPlayers}</p>
                <p className="text-purple-400 text-xs mt-2">Active</p>
              </div>
              <div className="p-3 bg-purple-600 rounded-xl">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* My Activities */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">My Tasks</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.myActivities}</p>
                <p className="text-orange-400 text-xs mt-2">Pending</p>
              </div>
              <div className="p-3 bg-orange-600 rounded-xl">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Events</h3>
            <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-sm font-semibold rounded-lg transition-colors duration-200">
              View All
            </button>
          </div>
          
          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div 
                  key={event.event_id} 
                  className="bg-gray-700/30 border border-gray-600/50 rounded-xl p-4 hover:border-yellow-500/50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        event.type === 'training' ? 'bg-blue-600' :
                        event.type === 'match' ? 'bg-green-600' :
                        'bg-purple-600'
                      }`}>
                        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{event.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(event.event_date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })} • {event.location}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      event.type === 'training' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'match' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">No events found</p>
              <p className="text-gray-500 text-sm mt-2">Events will appear here once they&apos;re created</p>
            </div>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
