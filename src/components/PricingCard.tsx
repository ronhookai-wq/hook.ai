import React, { useState } from 'react';
import { Check, Loader as Loader2 } from 'lucide-react';
import { StripeProduct, formatPrice } from '../stripe-config';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
  onSubscribe: (priceId: string) => Promise<void>;
  currentPlan?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ 
  product, 
  isPopular = false, 
  onSubscribe,
  currentPlan 
}) => {
  const [loading, setLoading] = useState(false);
  const isCurrentPlan = currentPlan === product.name;

  const handleSubscribe = async () => {
    if (isCurrentPlan) return;
    
    setLoading(true);
    try {
      await onSubscribe(product.priceId);
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = {
    Basic: [
      'Up to 5 projects',
      'Basic analytics',
      'Email support',
      '10GB storage',
      'Standard templates'
    ],
    Pro: [
      'Up to 25 projects',
      'Advanced analytics',
      'Priority support',
      '100GB storage',
      'Premium templates',
      'Custom integrations'
    ],
    Agency: [
      'Unlimited projects',
      'Enterprise analytics',
      'Dedicated support',
      '1TB storage',
      'White-label solution',
      'Custom integrations',
      'API access',
      'Team collaboration'
    ]
  };

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isPopular ? 'border-indigo-500 scale-105' : 'border-gray-200'
    } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Current Plan
          </span>
        </div>
      )}

      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-gray-600 ml-1">/month</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features[product.name as keyof typeof features]?.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
            isCurrentPlan
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : isPopular
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            `Subscribe to ${product.name}`
          )}
        </button>
      </div>
    </div>
  );
};