'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScoutDashboard from '@/components/ScoutDashboard/ScoutDashboard';

const ScoutPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      
      // Check if user is a scout
      if (payload.role !== 'scout') {
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
      return;
    }
    
    setLoading(false);
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'scout') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to scouts.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return <ScoutDashboard />;
};

export default ScoutPage;






