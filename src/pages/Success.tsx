import React, { useEffect, useState } from 'react';
import { CircleCheck as CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export const Success: React.FC = () => {
  const { plan, loading } = useSubscription();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
        </div>
      )}
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Welcome to your new subscription plan
          </p>
        </div>

        {plan && (
          <div className="bg-indigo-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-indigo-900">
                {plan.name} Plan
              </h2>
            </div>
            <p className="text-indigo-700 mb-3">{plan.description}</p>
            <div className="text-2xl font-bold text-indigo-900">
              ${plan.price}/month
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What's next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your subscription is now active</li>
              <li>• You have access to all plan features</li>
              <li>• Check your email for the receipt</li>
              <li>• Manage your subscription in your account</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};