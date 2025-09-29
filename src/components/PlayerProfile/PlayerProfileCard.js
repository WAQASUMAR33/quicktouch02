'use client';

import { useState } from 'react';
import Image from 'next/image';

const PlayerProfileCard = ({ player, stats, videos, feedback, onEdit, onAddVideo, onAddFeedback }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getAverageRating = () => {
    if (!feedback || feedback.length === 0) return 0;
    const total = feedback.reduce((sum, f) => sum + parseFloat(f.rating), 0);
    return (total / feedback.length).toFixed(1);
  };
  
  const getTotalStats = () => {
    if (!stats || stats.length === 0) return { goals: 0, assists: 0, matches: 0 };
    
    return stats.reduce((totals, stat) => ({
      goals: totals.goals + stat.goals,
      assists: totals.assists + stat.assists,
      matches: totals.matches + stat.matches_played
    }), { goals: 0, assists: 0, matches: 0 });
  };
  
  const totalStats = getTotalStats();
  
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
            {player.profile_pic ? (
              <Image
                src={player.profile_pic}
                alt={player.full_name}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="text-blue-600 text-2xl font-bold">
                {player.full_name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{player.full_name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                {player.position}
              </span>
              <span className="text-blue-200">{player.age} years old</span>
              <span className="text-blue-200">{player.height_cm}cm</span>
              <span className="text-blue-200">{player.weight_kg}kg</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">{getAverageRating()}/5.0</div>
            <div className="text-blue-200">Average Rating</div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {['overview', 'stats', 'videos', 'feedback'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Goals:</span>
                  <span className="font-bold text-green-600">{totalStats.goals}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Assists:</span>
                  <span className="font-bold text-blue-600">{totalStats.assists}</span>
                </div>
                <div className="flex justify-between">
                  <span>Matches Played:</span>
                  <span className="font-bold">{totalStats.matches}</span>
                </div>
                <div className="flex justify-between">
                  <span>Highlight Videos:</span>
                  <span className="font-bold">{videos?.length || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Player Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Player Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Position:</span>
                  <span className="font-medium">{player.position}</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Foot:</span>
                  <span className="font-medium">{player.preferred_foot}</span>
                </div>
                <div className="flex justify-between">
                  <span>Height:</span>
                  <span className="font-medium">{player.height_cm}cm</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span className="font-medium">{player.weight_kg}kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="font-medium">{formatDate(player.created_at)}</span>
                </div>
              </div>
            </div>
            
            {/* Recent Feedback */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
              {feedback && feedback.length > 0 ? (
                <div className="space-y-3">
                  {feedback.slice(0, 3).map((f) => (
                    <div key={f.feedback_id} className="border-l-4 border-blue-500 pl-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{f.rating}/5</span>
                        <span className="text-gray-500 text-sm">{formatDate(f.feedback_date)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{f.coach_name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No feedback yet</p>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Match Statistics</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Add Match Stats
              </button>
            </div>
            
            {stats && stats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Season
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goals
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assists
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Minutes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.map((stat) => (
                      <tr key={stat.season}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stat.season}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.matches_played}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.goals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.minutes_played}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No statistics available yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Highlight Videos</h3>
              <button 
                onClick={onAddVideo}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Video
              </button>
            </div>
            
            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.video_id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500">Video Player</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium mb-2">{video.description || 'Untitled'}</h4>
                      <p className="text-sm text-gray-500">{formatDate(video.uploaded_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No videos uploaded yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'feedback' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Coach Feedback</h3>
              <button 
                onClick={onAddFeedback}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Feedback
              </button>
            </div>
            
            {feedback && feedback.length > 0 ? (
              <div className="space-y-4">
                {feedback.map((f) => (
                  <div key={f.feedback_id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{f.coach_name}</h4>
                        <p className="text-sm text-gray-500">{formatDate(f.feedback_date)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${
                              i < f.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-2 font-medium">{f.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{f.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No feedback received yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfileCard;






