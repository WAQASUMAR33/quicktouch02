'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch('/api/auth/academy/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/academy/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Email verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-pulse">
                <svg className="h-10 w-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="h-20 w-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {status === 'verifying' && 'Verifying Email...'}
              {status === 'success' && 'Email Verified! 🎉'}
              {status === 'error' && 'Verification Failed'}
            </h2>
            <p className="text-gray-400">
              {status === 'verifying' && 'Please wait while we verify your email address'}
              {status === 'success' && 'Your account is now active'}
              {status === 'error' && 'We couldn\'t verify your email'}
            </p>
          </div>

          {/* Message */}
          <div className={`p-4 rounded-xl border ${
            status === 'verifying' ? 'bg-yellow-900/20 border-yellow-500/30' :
            status === 'success' ? 'bg-green-900/20 border-green-500/30' :
            'bg-red-900/20 border-red-500/30'
          }`}>
            <p className={`text-center ${
              status === 'verifying' ? 'text-yellow-200' :
              status === 'success' ? 'text-green-200' :
              'text-red-200'
            }`}>
              {message || 'Processing your request...'}
            </p>
          </div>

          {/* Actions */}
          {status === 'error' && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push('/academy/login')}
                className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-xl transition-colors duration-200"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/academy/signup')}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors duration-200"
              >
                Register Again
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6">
              <div className="flex items-center justify-center text-sm text-gray-400">
                <svg className="animate-spin h-4 w-4 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting to login page...
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200 group"
          >
            <svg className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

