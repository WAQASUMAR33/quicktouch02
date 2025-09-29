'use client';

import { useState, useEffect } from 'react';

const AttendanceTracker = ({ event, players, onSaveAttendance }) => {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    // Initialize attendance state
    const initialAttendance = {};
    players.forEach(player => {
      initialAttendance[player.player_id] = {
        present: false,
        performance_rating: 0,
        notes: ''
      };
    });
    setAttendance(initialAttendance);
  }, [players]);
  
  const handleAttendanceChange = (playerId, field, value) => {
    setAttendance(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }));
  };
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSaveAttendance(event.event_id, attendance);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getAttendanceStats = () => {
    const total = players.length;
    const present = Object.values(attendance).filter(a => a.present).length;
    const absent = total - present;
    const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    
    return { total, present, absent, attendanceRate };
  };
  
  const stats = getAttendanceStats();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{event.title}</h2>
            <p className="text-gray-600">{event.location}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.event_date).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate}%</div>
            <div className="text-sm text-gray-500">Attendance Rate</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-500">Present</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-500">Absent</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
      
      {/* Attendance List */}
      <div className="p-6">
        <div className="space-y-4">
          {players.map(player => (
            <div key={player.player_id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              {/* Player Info */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{player.full_name}</h3>
                <p className="text-sm text-gray-500">{player.position}</p>
              </div>
              
              {/* Attendance Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`present-${player.player_id}`}
                    name={`attendance-${player.player_id}`}
                    checked={attendance[player.player_id]?.present === true}
                    onChange={() => handleAttendanceChange(player.player_id, 'present', true)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor={`present-${player.player_id}`} className="text-sm text-green-600">
                    Present
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`absent-${player.player_id}`}
                    name={`attendance-${player.player_id}`}
                    checked={attendance[player.player_id]?.present === false}
                    onChange={() => handleAttendanceChange(player.player_id, 'present', false)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor={`absent-${player.player_id}`} className="text-sm text-red-600">
                    Absent
                  </label>
                </div>
              </div>
              
              {/* Performance Rating */}
              {attendance[player.player_id]?.present && (
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">Rating:</label>
                  <select
                    value={attendance[player.player_id]?.performance_rating || 0}
                    onChange={(e) => handleAttendanceChange(player.player_id, 'performance_rating', parseFloat(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>N/A</option>
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={3}>3 - Average</option>
                    <option value={4}>4 - Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Notes Section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Notes</h3>
          <div className="space-y-4">
            {players.map(player => (
              <div key={player.player_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-medium text-gray-900">{player.full_name}</span>
                  {attendance[player.player_id]?.present && (
                    <span className="text-sm text-green-600">Present</span>
                  )}
                </div>
                <textarea
                  value={attendance[player.player_id]?.notes || ''}
                  onChange={(e) => handleAttendanceChange(player.player_id, 'notes', e.target.value)}
                  placeholder="Add performance notes for this player..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;






