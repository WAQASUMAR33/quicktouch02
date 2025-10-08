// Academy Authentication Utilities

/**
 * Get academy data from localStorage
 * @returns {Object|null} Academy data or null if not found
 */
export function getAcademyData() {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('academy_token');
  const academyData = localStorage.getItem('academy_data');
  
  if (!token || !academyData) {
    return null;
  }
  
  try {
    const parsedAcademy = JSON.parse(academyData);
    
    // Check if academy is active
    if (!parsedAcademy.is_active) {
      return null;
    }
    
    // Return academy data mapped to user format for UI compatibility
    return {
      ...parsedAcademy,
      fullName: parsedAcademy.name,
      role: 'academy',
      email: parsedAcademy.email
    };
  } catch (error) {
    console.error('Error parsing academy data:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAcademyAuthenticated() {
  return getAcademyData() !== null;
}

/**
 * Logout academy user
 */
export function logoutAcademy() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('academy_token');
  localStorage.removeItem('academy_data');
  localStorage.removeItem('academy_user'); // Backward compatibility
}

/**
 * Get academy token
 * @returns {string|null} Token or null
 */
export function getAcademyToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('academy_token');
}

/**
 * Get role display name
 * @param {string} role - User role
 * @returns {string} Display name
 */
export function getRoleDisplayName(role) {
  switch (role) {
    case 'academy': return 'Academy';
    case 'admin': return 'Admin';
    case 'coach': return 'Coach';
    case 'player': return 'Player';
    case 'scout': return 'Scout';
    default: return 'User';
  }
}

/**
 * Get role color
 * @param {string} role - User role
 * @returns {string} Tailwind gradient classes
 */
export function getRoleColor(role) {
  switch (role) {
    case 'academy': return 'from-yellow-500 to-yellow-600';
    case 'admin': return 'from-red-500 to-red-600';
    case 'coach': return 'from-blue-500 to-blue-600';
    case 'player': return 'from-yellow-500 to-yellow-600';
    case 'scout': return 'from-purple-500 to-purple-600';
    default: return 'from-gray-500 to-gray-600';
  }
}

/**
 * Get navigation items based on role
 * @param {string} role - User role
 * @param {string} currentPage - Current page path
 * @returns {Array} Navigation items
 */
export function getNavigationItems(role, currentPage = '/academy/dashboard') {
  const baseItems = [
    { 
      name: 'Dashboard', 
      href: '/academy/dashboard', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', 
      current: currentPage === '/academy/dashboard'
    },
    { 
      name: 'Events', 
      href: '/academy/events', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', 
      current: currentPage === '/academy/events'
    },
    { 
      name: 'My Profile', 
      href: '/academy/profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', 
      current: currentPage === '/academy/profile'
    }
  ];

  // Academy-specific navigation
  if (role === 'academy') {
    baseItems.push(
      { 
        name: 'Training Plans', 
        href: '/academy/training-plans', 
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', 
        current: currentPage === '/academy/training-plans'
      },
      { 
        name: 'All Players', 
        href: '/academy/players', 
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', 
        current: currentPage === '/academy/players'
      },
      { 
        name: 'Settings', 
        href: '/academy/settings', 
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 
        current: currentPage === '/academy/settings'
      }
    );
  }

  // Admin-specific navigation
  if (role === 'admin') {
    baseItems.push(
      { 
        name: 'All Users', 
        href: '/academy/users', 
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', 
        current: currentPage === '/academy/users'
      },
      { 
        name: 'Training Plans', 
        href: '/academy/training-plans', 
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', 
        current: currentPage === '/academy/training-plans'
      },
      { 
        name: 'All Players', 
        href: '/academy/players', 
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', 
        current: currentPage === '/academy/players'
      },
      { 
        name: 'Reports', 
        href: '/academy/reports', 
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
        current: currentPage === '/academy/reports'
      }
    );
  }

  // Coach-specific navigation
  if (role === 'coach') {
    baseItems.push(
      { 
        name: 'Training Plans', 
        href: '/academy/training-plans', 
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', 
        current: currentPage === '/academy/training-plans'
      },
      { 
        name: 'My Players', 
        href: '/academy/players', 
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', 
        current: currentPage === '/academy/players'
      },
      { 
        name: 'Feedback', 
        href: '/academy/feedback', 
        icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', 
        current: currentPage === '/academy/feedback'
      }
    );
  }

  // Player-specific navigation
  if (role === 'player') {
    baseItems.push(
      { 
        name: 'My Videos', 
        href: '/academy/videos', 
        icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', 
        current: currentPage === '/academy/videos'
      },
      { 
        name: 'My Stats', 
        href: '/academy/stats', 
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', 
        current: currentPage === '/academy/stats'
      }
    );
  }

  // Scout-specific navigation
  if (role === 'scout') {
    baseItems.push(
      { 
        name: 'Player Discovery', 
        href: '/academy/discovery', 
        icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', 
        current: currentPage === '/academy/discovery'
      },
      { 
        name: 'My Favorites', 
        href: '/academy/favorites', 
        icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', 
        current: currentPage === '/academy/favorites'
      },
      { 
        name: 'Reports', 
        href: '/academy/reports', 
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', 
        current: currentPage === '/academy/reports'
      }
    );
  }

  return baseItems;
}

