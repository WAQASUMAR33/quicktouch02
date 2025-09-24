'use client';

import { useState, useEffect, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import ScoutFilters from './ScoutFilters';
import ScoutFavorites from './ScoutFavorites';

const ScoutDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');
  const [filters, setFilters] = useState({
    age: '',
    position: '',
    minGoals: '',
    maxGoals: '',
    minAssists: '',
    maxAssists: ''
  });
  
  useEffect(() => {
    fetchPlayers();
    fetchFavorites();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
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
  
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/scout/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  
  const applyFilters = useCallback(() => {
    let filtered = [...players];
    
    if (filters.age) {
      filtered = filtered.filter(player => player.age === parseInt(filters.age));
    }
    
    if (filters.position) {
      filtered = filtered.filter(player => player.position === filters.position);
    }
    
    if (filters.minGoals) {
      filtered = filtered.filter(player => player.total_goals >= parseInt(filters.minGoals));
    }
    
    if (filters.maxGoals) {
      filtered = filtered.filter(player => player.total_goals <= parseInt(filters.maxGoals));
    }
    
    if (filters.minAssists) {
      filtered = filtered.filter(player => player.total_assists >= parseInt(filters.minAssists));
    }
    
    if (filters.maxAssists) {
      filtered = filtered.filter(player => player.total_assists <= parseInt(filters.maxAssists));
    }
    
    setFilteredPlayers(filtered);
  }, [players, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleAddFavorite = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/scout/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerId })
      });
      
      if (response.ok) {
        fetchFavorites(); // Refresh favorites
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };
  
  const handleRemoveFavorite = async (playerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/scout/favorites/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchFavorites(); // Refresh favorites
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  
  const handleContactPlayer = (playerId) => {
    // Open contact modal or redirect to contact form
    console.log('Contact player:', playerId);
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Scout Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover and evaluate talented players
              </p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              VIP Access
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'browse', name: 'Browse Players', count: filteredPlayers.length },
              { id: 'favorites', name: 'My Favorites', count: favorites.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
        
        {/* Filters */}
        {activeTab === 'browse' && (
          <div className="mb-8">
            <ScoutFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={() => setFilters({
                age: '',
                position: '',
                minGoals: '',
                maxGoals: '',
                minAssists: '',
                maxAssists: ''
              })}
            />
          </div>
        )}
        
        {/* Content */}
        {activeTab === 'browse' && (
          <div>
            {filteredPlayers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.player_id}
                    player={player}
                    isFavorite={favorites.some(fav => fav.player_id === player.player_id)}
                    onAddFavorite={handleAddFavorite}
                    onRemoveFavorite={handleRemoveFavorite}
                    onContactPlayer={handleContactPlayer}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No players found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'favorites' && (
          <ScoutFavorites
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onContactPlayer={handleContactPlayer}
          />
        )}
      </div>
    </div>
  );
};

export default ScoutDashboard;

