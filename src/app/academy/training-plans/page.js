'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAcademyData, logoutAcademy, getRoleDisplayName, getRoleColor, getNavigationItems } from '@/lib/academyAuth';

export default function TrainingPlans() {
  const [user, setUser] = useState(null);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [currentTime, setCurrentTime] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [newPlan, setNewPlan] = useState({
    title: '',
    title_type: 'TrainingProgram',
    venue: '',
    program_date: '',
    program_time: '',
    details: '',
    status: 'upcoming'
  });
  const [editPlan, setEditPlan] = useState({
    title: '',
    title_type: 'TrainingProgram',
    venue: '',
    program_date: '',
    program_time: '',
    details: '',
    status: 'upcoming'
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const academyData = getAcademyData();
    
    if (!academyData) {
      router.push('/academy/login');
      return;
    }

    // Academies and coaches can access training plans
    if (academyData.role !== 'coach' && academyData.role !== 'academy') {
      router.push('/academy/dashboard');
      return;
    }

    setUser(academyData);
    loadTrainingPlans();
  }, [router]);

  useEffect(() => {
    // Set current time on client side only
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const loadTrainingPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/coach/training-plans');
      
      if (response.ok) {
        const data = await response.json();
        setTrainingPlans(data.training_plans);
        setFilteredPlans(data.training_plans);
      }
    } catch (error) {
      console.error('Error loading training plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === 'all') {
      setFilteredPlans(trainingPlans);
    } else if (type === 'upcoming') {
      setFilteredPlans(trainingPlans.filter(p => p.status === 'upcoming'));
    } else if (type === 'Complete') {
      setFilteredPlans(trainingPlans.filter(p => p.status === 'Complete'));
    } else {
      setFilteredPlans(trainingPlans.filter(p => p.title_type === type));
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const planData = {
        ...newPlan,
        coach_id: user.userId,
        academy_id: user.academyId || 1
      };

      const response = await fetch('/api/coach/training-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      const data = await response.json();

      if (response.ok) {
        setCreateSuccess('Training plan created successfully!');
        setNewPlan({
          title: '',
          title_type: 'TrainingProgram',
          venue: '',
          program_date: '',
          program_time: '',
          details: '',
          status: 'upcoming'
        });
        
        await loadTrainingPlans();
        
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateSuccess('');
        }, 2000);
      } else {
        setCreateError(data.error || 'Failed to create training plan');
      }
    } catch (error) {
      console.error('Error creating training plan:', error);
      setCreateError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCreateError('');
    setCreateSuccess('');
    setNewPlan({
      title: '',
      title_type: 'TrainingProgram',
      venue: '',
      program_date: '',
      program_time: '',
      details: '',
      status: 'upcoming'
    });
  };

  const handleViewDetails = (plan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPlan(null);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setEditPlan({
      title: plan.title,
      title_type: plan.title_type,
      venue: plan.venue || '',
      program_date: plan.program_date ? new Date(plan.program_date).toISOString().split('T')[0] : '',
      program_time: plan.program_time || '',
      details: plan.details || '',
      status: plan.status
    });
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEditError('');
    setEditSuccess('');

    try {
      const response = await fetch(`/api/coach/training-plans/${selectedPlan.plan_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPlan),
      });

      const data = await response.json();

      if (response.ok) {
        setEditSuccess('Training plan updated successfully!');
        await loadTrainingPlans();
        
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess('');
          setSelectedPlan(null);
        }, 2000);
      } else {
        setEditError(data.error || 'Failed to update training plan');
      }
    } catch (error) {
      console.error('Error updating training plan:', error);
      setEditError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!confirm('Are you sure you want to delete this training plan? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/coach/training-plans/${selectedPlan.plan_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadTrainingPlans();
        setShowDetailsModal(false);
        setSelectedPlan(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete training plan');
      }
    } catch (error) {
      console.error('Error deleting training plan:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logoutAcademy();
    router.push('/academy/login');
  };

  

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading training plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0`}>
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

        <div className="px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className={`h-12 w-12 bg-gradient-to-br ${getRoleColor(user?.role)} rounded-full flex items-center justify-center shadow-lg`}>
              <span className="text-lg font-bold text-white">
                {user?.fullName?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 bg-yellow-500/20 text-yellow-400">
                Coach
              </span>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {getNavigationItems(user?.role, '/academy/training-plans').map((item) => (
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

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div>
                <h2 className="text-xl font-bold text-white">Training Plans</h2>
                <p className="text-xs text-gray-400">Manage training programs</p>
              </div>

              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">
                  {currentTime || 'Loading...'}
                </p>
                <p className="text-xs text-gray-400">
                  Today
                </p>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6 lg:p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">All Training Plans</h3>
              <p className="text-gray-400">Total: {filteredPlans.length} plans</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Plan
            </button>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'all' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'upcoming' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleFilterChange('Complete')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'Complete' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => handleFilterChange('TrainingProgram')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'TrainingProgram' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Training
            </button>
            <button
              onClick={() => handleFilterChange('Match')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'Match' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Match
            </button>
            <button
              onClick={() => handleFilterChange('Drill')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterType === 'Drill' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Drill
            </button>
          </div>

          {filteredPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.plan_id}
                  className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      plan.title_type === 'TrainingProgram' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      plan.title_type === 'Match' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {plan.title_type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      plan.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {plan.status}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2">{plan.title}</h4>

                  <div className="space-y-2">
                    {plan.program_date && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(plan.program_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                    {plan.program_time && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {plan.program_time}
                      </div>
                    )}
                    {plan.venue && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {plan.venue}
                      </div>
                    )}
                  </div>

                  {plan.details && (
                    <p className="mt-4 text-gray-400 text-sm line-clamp-2">{plan.details}</p>
                  )}

                  <button 
                    onClick={() => handleViewDetails(plan)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">No Training Plans Found</h3>
              <p className="text-gray-400">
                {filterType === 'all' ? 'Create your first training plan' : `No ${filterType} training plans found.`}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseModal}></div>

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Create Training Plan</h3>
                <button type="button" onClick={handleCloseModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePlan} className="px-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Title *</label>
                  <input type="text" name="title" required value={newPlan.title} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter plan title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Type *</label>
                  <select name="title_type" required value={newPlan.title_type} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="TrainingProgram">Training Program</option>
                    <option value="Match">Match</option>
                    <option value="Drill">Drill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Date</label>
                  <input type="date" name="program_date" value={newPlan.program_date} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Time</label>
                  <input type="time" name="program_time" value={newPlan.program_time} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Venue</label>
                  <input type="text" name="venue" value={newPlan.venue} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter venue" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Details</label>
                  <textarea name="details" rows="3" value={newPlan.details} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Enter training details"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
                  <select name="status" value={newPlan.status} onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="upcoming">Upcoming</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

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

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Creating...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCloseDetails}></div>

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Training Plan Details</h3>
                <button type="button" onClick={handleCloseDetails}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPlan.title}</h2>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedPlan.title_type === 'TrainingProgram' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      selectedPlan.title_type === 'Match' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {selectedPlan.title_type}
                    </span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedPlan.status === 'upcoming' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedPlan.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlan.program_date && (
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-semibold text-white">
                        {new Date(selectedPlan.program_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {selectedPlan.program_time && (
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Time</p>
                      <p className="text-sm font-semibold text-white">{selectedPlan.program_time}</p>
                    </div>
                  )}
                  {selectedPlan.venue && (
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Venue</p>
                      <p className="text-sm font-semibold text-white">{selectedPlan.venue}</p>
                    </div>
                  )}
                </div>

                {selectedPlan.details && (
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Details</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{selectedPlan.details}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-900/30 border-t border-gray-700">
              <div className="flex gap-3">
                <button onClick={handleCloseDetails}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200">
                  Close
                </button>
                <button onClick={() => handleEditClick(selectedPlan)}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button onClick={handleDeletePlan} disabled={isDeleting}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
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

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>

          <div className="relative bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 z-10 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Edit Training Plan</h3>
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdatePlan} className="px-6 py-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Title *</label>
                  <input type="text" name="title" required value={editPlan.title} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter plan title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Type *</label>
                  <select name="title_type" required value={editPlan.title_type} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="TrainingProgram">Training Program</option>
                    <option value="Match">Match</option>
                    <option value="Drill">Drill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Date</label>
                  <input type="date" name="program_date" value={editPlan.program_date} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Time</label>
                  <input type="time" name="program_time" value={editPlan.program_time} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Venue</label>
                  <input type="text" name="venue" value={editPlan.venue} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter venue" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Details</label>
                  <textarea name="details" rows="3" value={editPlan.details} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Enter training details"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
                  <select name="status" value={editPlan.status} onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="upcoming">Upcoming</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

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

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update Plan'
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

