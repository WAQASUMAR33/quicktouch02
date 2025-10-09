'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
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
        setMessage('Your email has been verified successfully!');
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg p-8 shadow-xl border border-gray-800 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500 bg-opacity-20">
                <svg className="w-8 h-8 text-yellow-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 bg-opacity-20">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500 bg-opacity-20">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified! 🎉'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          {/* Message */}
          <p className={`mb-6 ${
            status === 'verifying' ? 'text-yellow-400' :
            status === 'success' ? 'text-green-400' :
            'text-red-400'
          }`}>
            {message || 'Processing your request...'}
          </p>

          {/* Actions */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/academy/login')}
                className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/academy/signup')}
                className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
              >
                Register Again
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center text-sm text-gray-400">
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirecting to login page...
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-400 hover:text-white inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
