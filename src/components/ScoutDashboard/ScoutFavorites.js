'use client';

import { useState } from 'react';
import Image from 'next/image';

const ScoutFavorites = ({ favorites, onRemoveFavorite, onContactPlayer }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleContactClick = (player) => {
    setSelectedPlayer(player);
    setShowContactModal(true);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const message = formData.get('message');
    
    // Send contact message
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: selectedPlayer.user_id,
          message_text: message
        })
      });
      
      if (response.ok) {
        setShowContactModal(false);
        setSelectedPlayer(null);
        alert('Message sent successfully!');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-500">
          Start browsing players and add them to your favorites to keep track of talent you&apos;re interested in.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => {
          const player = favorite.player;
          return (
            <div key={favorite.favorite_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Player Image */}
              <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                {player.user.profile_pic ? (
                  <Image
                    src={player.user.profile_pic}
                    alt={player.user.full_name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-2xl font-bold">
                      {player.user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Player Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{player.user.full_name}</h3>
                    <p className="text-red-600 font-medium">{player.position}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-xl">❤️</span>
                    <button
                      onClick={() => onRemoveFavorite(player.player_id)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                      title="Remove from favorites"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {player.player_stats?.reduce((sum, stat) => sum + stat.goals, 0) || 0}
                    </div>
                    <div className="text-xs text-gray-500">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {player.player_stats?.reduce((sum, stat) => sum + stat.assists, 0) || 0}
                    </div>
                    <div className="text-xs text-gray-500">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {player.player_stats?.reduce((sum, stat) => sum + stat.matches_played, 0) || 0}
                    </div>
                    <div className="text-xs text-gray-500">Matches</div>
                  </div>
                </div>
                
                {/* Player Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium">{player.age} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Height:</span>
                    <span className="font-medium">{player.height_cm}cm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Foot:</span>
                    <span className="font-medium">{player.preferred_foot}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Added:</span>
                    <span className="font-medium">{formatDate(favorite.added_at)}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/players/${player.player_id}`, '_blank')}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleContactClick(player)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Contact Modal */}
      {showContactModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Contact {selectedPlayer.user.full_name}</h3>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedPlayer(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Write your message about this player..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedPlayer(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ScoutFavorites;
