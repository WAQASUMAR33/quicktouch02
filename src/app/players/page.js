'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PlayerProfileCard from '@/components/PlayerProfile/PlayerProfileCard';
import PlayerProfileForm from '@/components/PlayerProfile/PlayerProfileForm';

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
    
    fetchPlayers();
  }, [router]);
  
  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/players', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreatePlayer = () => {
    if (user?.role === 'player') {
      setShowCreateForm(true);
    } else {
      alert('Only players can create profiles');
    }
  };
  
  const handlePlayerCreated = () => {
    setShowCreateForm(false);
    fetchPlayers();
  };
  
  const handleViewPlayer = (playerId) => {
    router.push(`/players/${playerId}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <PlayerProfileForm onSuccess={handlePlayerCreated} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Players</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage player profiles and view statistics
              </p>
            </div>
            {user?.role === 'player' && (
              <button
                onClick={handleCreatePlayer}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Players Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (
              <div
                key={player.player_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewPlayer(player.player_id)}
              >
                {/* Player Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  {player.profile_pic ? (
                    <Image
                      src={player.profile_pic}
                      alt={player.full_name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover border-4 border-white"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-2xl font-bold">
                        {player.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Player Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{player.full_name}</h3>
                      <p className="text-blue-600 font-medium">{player.position}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {player.age} years
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{player.total_goals || 0}</div>
                      <div className="text-xs text-gray-500">Goals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{player.total_assists || 0}</div>
                      <div className="text-xs text-gray-500">Assists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{player.total_matches || 0}</div>
                      <div className="text-xs text-gray-500">Matches</div>
                    </div>
                  </div>
                  
                  {/* Player Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Height:</span>
                      <span className="font-medium">{player.height_cm}cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Weight:</span>
                      <span className="font-medium">{player.weight_kg}kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Foot:</span>
                      <span className="font-medium">{player.preferred_foot}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚽</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-500">Start by creating a player profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;

