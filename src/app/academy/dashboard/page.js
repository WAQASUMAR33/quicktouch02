'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    const allowedRoles = ['coach', 'player', 'scout'];
    
    if (!allowedRoles.includes(parsedUser.role)) {
      router.push('/academy/login');
      return;
    }

    setUser(parsedUser);
    loadDashboardData();
  }, [router]);

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

      // Mock data for other stats (replace with actual API calls)
      setStats(prev => ({
        ...prev,
        totalPlayers: user?.role === 'coach' ? 25 : 0,
        myActivities: user?.role === 'player' ? 12 : user?.role === 'coach' ? 8 : 15
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('academy_token');
    localStorage.removeItem('academy_user');
    router.push('/academy/login');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'coach': return 'Coach';
      case 'player': return 'Player';
      case 'scout': return 'Scout';
      default: return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'player': return 'bg-green-100 text-green-800';
      case 'scout': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Academy Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user?.role)}`}>
                  {getRoleDisplayName(user?.role)}
                </span>
                <span className="text-sm text-gray-600">{user?.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name}!
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening in your academy today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>

          {/* Role-specific Stats */}
          {user?.role === 'coach' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Players</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalPlayers}</p>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'player' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Training Sessions</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.myActivities}</p>
                </div>
              </div>
            </div>
          )}

          {user?.role === 'scout' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Players Scouted</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.myActivities}</p>
                </div>
              </div>
            </div>
          )}

          {/* My Activities (general) */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Activities</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.myActivities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {user?.role === 'coach' && (
                <>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Training Plans</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Player Feedback</span>
                    </div>
                  </button>
                </>
              )}
              
              {user?.role === 'player' && (
                <>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">My Profile</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">My Videos</span>
                    </div>
                  </button>
                </>
              )}
              
              {user?.role === 'scout' && (
                <>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Browse Players</span>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Favorites</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event.event_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.event_date).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'training' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'match' ? 'bg-green-100 text-green-800' :
                      event.type === 'trial' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent events found</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
