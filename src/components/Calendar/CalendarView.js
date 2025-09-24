'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

const CalendarView = ({ events, onEventClick, onCreateEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.event_date), date));
  };
  
  const getEventTypeColor = (type) => {
    const colors = {
      training: 'bg-blue-500',
      match: 'bg-green-500',
      trial: 'bg-yellow-500',
      showcase: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };
  
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={view}
            onChange={(e) => setView(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button
            onClick={onCreateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Event
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map(day => {
            const dayEvents = getEventsForDate(day);
            const isCurrentDay = isToday(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border border-gray-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isCurrentDay ? 'bg-blue-50 border-blue-300' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.event_id}
                      onClick={() => onEventClick(event)}
                      className={`text-xs p-1 rounded cursor-pointer text-white truncate ${getEventTypeColor(event.type)}`}
                    >
                      {format(new Date(event.event_date), 'HH:mm')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="px-6 py-4 border-t bg-gray-50">
        <div className="flex items-center space-x-4 text-sm">
          <span className="font-medium text-gray-700">Event Types:</span>
          {[
            { type: 'training', label: 'Training', color: 'bg-blue-500' },
            { type: 'match', label: 'Match', color: 'bg-green-500' },
            { type: 'trial', label: 'Trial', color: 'bg-yellow-500' },
            { type: 'showcase', label: 'Showcase', color: 'bg-purple-500' }
          ].map(item => (
            <div key={item.type} className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded ${item.color}`}></div>
              <span className="text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;

