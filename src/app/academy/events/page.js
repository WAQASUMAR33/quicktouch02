'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AcademyEvents() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'training',
    event_date: '',
    location: '',
    description: '',
    created_by: null
  });
  const [editEvent, setEditEvent] = useState({
    title: '',
    type: 'training',
    event_date: '',
    location: '',
    description: ''
  });
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
    loadEvents();
  }, [router]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/events-simple');
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        setFilteredEvents(data.events);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === 'all') {
      setFilteredEvents(events);
    } else if (type === 'upcoming') {
      setFilteredEvents(events.filter(e => new Date(e.event_date) > new Date()));
    } else if (type === 'past') {
      setFilteredEvents(events.filter(e => new Date(e.event_date) <= new Date()));
    } else {
      setFilteredEvents(events.filter(e => e.type === type));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const eventData = {
        ...newEvent,
        created_by: user.userId
      };

      const response = await fetch('/api/admin/events-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        setCreateSuccess('Event created successfully!');
        setNewEvent({
          title: '',
          type: 'training',
          event_date: '',
          location: '',
          description: '',
          created_by: null
        });
        
        // Reload events
        await loadEvents();
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess('');
        }, 2000);
      } else {
        setCreateError(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setCreateError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateError('');
    setCreateSuccess('');
    setNewEvent({
      title: '',
      type: 'training',
      event_date: '',
      location: '',
      description: '',
      created_by: null
    });
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedEvent(null);
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setEditEvent({
      title: event.title,
      type: event.type,
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location || '',
      description: event.description || ''
    });
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError('');
    setEditSuccess('');

    try {
      const response = await fetch(`/api/admin/events-simple/${selectedEvent.event_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editEvent),
      });

      const data = await response.json();

      if (response.ok) {
        setEditSuccess('Event updated successfully!');
        await loadEvents();
        
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess('');
          setSelectedEvent(null);
        }, 2000);
      } else {
        setEditError(data.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setEditError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/events-simple/${selectedEvent.event_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadEvents();
        setShowDetailsModal(false);
        setSelectedEvent(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
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
      case 'coach': return 'from-blue-500 to-blue-600';
      case 'player': return 'from-yellow-500 to-yellow-600';
      case 'scout': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/academy/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', current: false },
      { name: 'Events', href: '/academy/events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', current: true },
      { name: 'My Profile', href: '/academy/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', current: false }
    ];

    if (user?.role === 'coach') {
      baseItems.push(
        { name: 'Training Plans', href: '/academy/training-plans', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', current: false },
        { name: 'My Players', href: '/academy/players', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', current: false },
        { name: 'Feedback', href: '/academy/feedback', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', current: false }
      );
    }

    if (user?.role === 'player') {
      baseItems.push(
        { name: 'My Profile', href: '/academy/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', current: false },
        { name: 'My Videos', href: '/academy/videos', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', current: false },
        { name: 'My Stats', href: '/academy/stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', current: false }
      );
    }

    if (user?.role === 'scout') {
      baseItems.push(
        { name: 'Player Discovery', href: '/academy/discovery', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', current: false },
        { name: 'My Favorites', href: '/academy/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', current: false },
        { name: 'Reports', href: '/academy/reports', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', current: false }
      );
    }

    return baseItems;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading events...</p>
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
                <h2 className="text-xl font-bold text-white">Events</h2>
                <p className="text-xs text-gray-400">Manage and view all events</p>
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
        <main className="p-6 lg:p-8">
          {/* Header with Create Button */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">All Events</h3>
              <p className="text-gray-400">Total: {filteredEvents.length} events</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Event
            </button>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'all'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'upcoming'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterChange('past')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'past'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => handleFilterChange('training')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'training'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Training
            </button>
            <button
              onClick={() => handleFilterChange('match')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'match'
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Match
            </button>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.event_id}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300"
                >
                  {/* Event Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      event.type === 'training' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      event.type === 'match' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {event.type}
                    </span>
                    <div className={`p-2 rounded-lg ${
                      event.type === 'training' ? 'bg-blue-600' :
                      event.type === 'match' ? 'bg-green-600' :
                      'bg-purple-600'
                    }`}>
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>

                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-400 text-sm">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <p className="mt-4 text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* View Details Button */}
                  <button 
                    onClick={() => handleViewDetails(event)}
                    className="mt-4 w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-12 border border-gray-700/50 text-center">
              <svg className="h-20 w-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
              <p className="text-gray-400">
                {filterType === 'all' 
                  ? 'No events available at the moment.' 
                  : `No ${filterType} events found.`}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>

          {/* Modal panel */}
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Create New Event</h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreateEvent} className="px-6 py-6">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={newEvent.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter event title"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-2">
                      Event Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={newEvent.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="training">Training</option>
                      <option value="match">Match</option>
                      <option value="trial">Trial</option>
                      <option value="showcase">Showcase</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium text-gray-200 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="datetime-local"
                      id="event_date"
                      name="event_date"
                      required
                      value={newEvent.event_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter location"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="3"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                      placeholder="Enter event description"
                    ></textarea>
                  </div>

                  {/* Success Message */}
                  {createSuccess && (
                    <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-200 text-sm font-medium">{createSuccess}</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {createError && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-200 text-sm font-medium">{createError}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </div>
        </div>
      )}

      {/* View Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseDetails}
          ></div>

          {/* Modal panel */}
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedEvent.type === 'training' ? 'bg-blue-600' :
                    selectedEvent.type === 'match' ? 'bg-green-600' :
                    'bg-purple-600'
                  }`}>
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Event Details</h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseDetails}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                  <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    selectedEvent.type === 'training' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    selectedEvent.type === 'match' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  }`}>
                    {selectedEvent.type.toUpperCase()}
                  </span>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                        <p className="text-sm font-semibold text-white">
                          {new Date(selectedEvent.event_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(selectedEvent.event_date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="text-sm font-semibold text-white">
                          {selectedEvent.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-2">Description</p>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedEvent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Event ID</p>
                    <p className="text-sm font-semibold text-white">#{selectedEvent.event_id}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Created</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(selectedEvent.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={handleCloseDetails}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEditClick(selectedEvent)}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDeleteEvent}
                  disabled={isDeleting}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          ></div>

          {/* Modal panel */}
          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Edit Event</h3>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateEvent} className="px-6 py-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="edit-title" className="block text-sm font-medium text-gray-200 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    required
                    value={editEvent.title}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter event title"
                  />
                </div>

                {/* Type */}
                <div>
                  <label htmlFor="edit-type" className="block text-sm font-medium text-gray-200 mb-2">
                    Event Type *
                  </label>
                  <select
                    id="edit-type"
                    name="type"
                    required
                    value={editEvent.type}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="training">Training</option>
                    <option value="match">Match</option>
                    <option value="trial">Trial</option>
                    <option value="showcase">Showcase</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="edit-event_date" className="block text-sm font-medium text-gray-200 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="datetime-local"
                    id="edit-event_date"
                    name="event_date"
                    required
                    value={editEvent.event_date}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-gray-200 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="edit-location"
                    name="location"
                    value={editEvent.location}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter location"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-200 mb-2">
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    rows="3"
                    value={editEvent.description}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Enter event description"
                  ></textarea>
                </div>

                {/* Success Message */}
                {editSuccess && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-200 text-sm font-medium">{editSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {editError && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-200 text-sm font-medium">{editError}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Event'
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


