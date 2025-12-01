import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { GoogleIcon } from './icons';

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

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { fullName }
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity"
         onClick={onClose}
    >
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md m-4"
           onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Hook.ai</h2>
          <p className="text-gray-400 mb-6">
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition"
          >
            <GoogleIcon />
          </button>
        </div>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
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
              <label className="block text-gray-400 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                className="bg-gray-900 border border-gray-700 rounded-lg w-full py-3 px-4 text-gray-300 focus:ring-2 focus:ring-cyan-500"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="bg-gray-900 border border-gray-700 rounded-lg w-full py-3 px-4 text-gray-300 focus:ring-2 focus:ring-cyan-500"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="bg-gray-900 border border-gray-700 rounded-lg w-full py-3 px-4 text-gray-300 focus:ring-2 focus:ring-cyan-500"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
