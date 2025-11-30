import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { LogOut, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { plan } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SubscriptionApp</h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              {plan && (
                <div className="flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                  <Crown className="w-4 h-4 text-indigo-600 mr-1" />
                  <span className="text-sm font-medium text-indigo-700">
                    {plan.name} Plan
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};