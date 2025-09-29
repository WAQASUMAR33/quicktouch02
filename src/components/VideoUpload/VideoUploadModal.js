'use client';

import { useState } from 'react';

const VideoUploadModal = ({ isOpen, onClose, playerId, onUpload }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a valid video file (MP4, MOV, AVI)');
      return;
    }
    
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 50MB');
      return;
    }
    
    setFile(selectedFile);
    setError('');
  };
  
  const handleUpload = async () => {
    if (!file || !description.trim()) {
      setError('Please select a file and enter a description');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('description', description);
      formData.append('playerId', playerId);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Reset form
      setFile(null);
      setDescription('');
      setProgress(0);
      
      // Notify parent component
      onUpload(result);
      
      // Close modal
      onClose();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  
  const handleClose = () => {
    if (!uploading) {
      setFile(null);
      setDescription('');
      setError('');
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Highlight Video</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: MP4, MOV, AVI. Max size: 50MB
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              rows={3}
              placeholder="Describe this highlight video..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          
          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">🎥</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || !description.trim() || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;





