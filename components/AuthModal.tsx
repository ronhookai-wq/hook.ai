
import React, { useState } from 'react';
import { GoogleIcon, FacebookIcon } from './icons';
import { signIn, signUp, signInWithGoogle, signInWithFacebook } from '../lib/api';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleFacebookSignIn = async () => {
    setError(null);
    try {
      await signInWithFacebook();
    } catch (err: any) {
      setError(err.message || 'Facebook sign-in failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4 transform transition-all duration-300 scale-95 hover:scale-100" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Hook.ai</h2>
          <p className="text-gray-400 mb-6">{isSignUp ? 'Create your account to get started' : 'Sign in to unlock your creativity'}</p>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={handleGoogleSignIn} type="button" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <GoogleIcon />
          </button>
          <button onClick={handleFacebookSignIn} type="button" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <FacebookIcon />
          </button>
        </div>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="shadow-inner appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-inner appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-inner appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-300 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isSignUp && (
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-sm">Stay logged in</span>
              </label>
            </div>
          )}
          <div className="flex flex-col space-y-3">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={loading}
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
