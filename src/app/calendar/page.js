'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/components/Calendar/CalendarView';
import EventModal from '@/components/Calendar/EventModal';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
      return;
    }
    
    fetchEvents();
  }, [router]);
  
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleEventSubmit = async (eventData) => {
    try {
      const token = localStorage.getItem('token');
      const method = selectedEvent ? 'PUT' : 'POST';
      const url = selectedEvent ? `/api/events/${selectedEvent.event_id}` : '/api/events';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      if (response.ok) {
        fetchEvents(); // Refresh events
        setShowEventModal(false);
      } else {
        throw new Error('Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      throw error;
    }
  };
  
  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Academy Calendar</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage training sessions, matches, and events
            </p>
          </div>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarView
          events={events}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
        
        {/* Event Modal */}
        <EventModal
          isOpen={showEventModal}
          onClose={handleCloseModal}
          event={selectedEvent}
          onSubmit={handleEventSubmit}
          mode={selectedEvent ? 'edit' : 'create'}
        />
      </div>
    </div>
  );
};

export default CalendarPage;





