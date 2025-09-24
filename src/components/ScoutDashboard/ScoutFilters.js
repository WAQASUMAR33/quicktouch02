'use client';

import { useState } from 'react';

const ScoutFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const positions = [
    'Goalkeeper',
    'Defender', 
    'Midfielder',
    'Forward',
    'Winger',
    'Striker'
  ];
  
  const ageRanges = [
    { value: '16', label: '16 years' },
    { value: '17', label: '17 years' },
    { value: '18', label: '18 years' },
    { value: '19', label: '19 years' },
    { value: '20', label: '20+ years' }
  ];
  
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Players</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Age Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <select
            value={filters.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Age</option>
            {ageRanges.map(age => (
              <option key={age.value} value={age.value}>{age.label}</option>
            ))}
          </select>
        </div>
        
        {/* Position Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position
          </label>
          <select
            value={filters.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        
        {/* Goals Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Goals
          </label>
          <input
            type="number"
            value={filters.minGoals}
            onChange={(e) => handleInputChange('minGoals', e.target.value)}
            placeholder="0"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Goals
              </label>
              <input
                type="number"
                value={filters.maxGoals}
                onChange={(e) => handleInputChange('maxGoals', e.target.value)}
                placeholder="No limit"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Assists
              </label>
              <input
                type="number"
                value={filters.minAssists}
                onChange={(e) => handleInputChange('minAssists', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Assists
              </label>
              <input
                type="number"
                value={filters.maxAssists}
                onChange={(e) => handleInputChange('maxAssists', e.target.value)}
                placeholder="No limit"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              const labels = {
                age: 'Age',
                position: 'Position',
                minGoals: 'Min Goals',
                maxGoals: 'Max Goals',
                minAssists: 'Min Assists',
                maxAssists: 'Max Assists'
              };
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {labels[key]}: {value}
                  <button
                    onClick={() => handleInputChange(key, '')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoutFilters;

