'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PlayerProfileCard from '@/components/PlayerProfile/PlayerProfileCard';
import VideoUploadModal from '@/components/VideoUpload/VideoUploadModal';

const PlayerProfilePage = ({ params }) => {
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [videos, setVideos] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
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
    
    fetchPlayerData();
  }, [params.id, router, fetchPlayerData]);
  
  const fetchPlayerData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/players/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlayer(data.player);
        setStats(data.stats);
        setVideos(data.videos);
        setFeedback(data.feedback);
      } else if (response.status === 404) {
        router.push('/players');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);
  
  const handleVideoUpload = (newVideo) => {
    setVideos(prev => [newVideo, ...prev]);
  };
  
  const handleEditProfile = () => {
    router.push(`/players/${params.id}/edit`);
  };
  
  const handleAddVideo = () => {
    setShowVideoUpload(true);
  };
  
  const handleAddFeedback = () => {
    // Open feedback form modal
    console.log('Add feedback');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Player not found</h2>
          <button
            onClick={() => router.push('/players')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Players
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/players')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <span>←</span>
            <span>Back to Players</span>
          </button>
        </div>
        
        {/* Player Profile Card */}
        <PlayerProfileCard
          player={player}
          stats={stats}
          videos={videos}
          feedback={feedback}
          onEdit={handleEditProfile}
          onAddVideo={handleAddVideo}
          onAddFeedback={handleAddFeedback}
        />
        
        {/* Video Upload Modal */}
        <VideoUploadModal
          isOpen={showVideoUpload}
          onClose={() => setShowVideoUpload(false)}
          playerId={params.id}
          onUpload={handleVideoUpload}
        />
      </div>
    </div>
  );
};

export default PlayerProfilePage;

