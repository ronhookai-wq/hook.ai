import React, { useState } from 'react';
import { PricingCard } from './PricingCard';
import { stripeProducts } from '../stripe-config';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

export const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const { plan } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stripeProducts.map((product, index) => (
            <PricingCard
              key={product.id}
              product={product}
              isPopular={index === 1}
              onSubscribe={handleSubscribe}
              currentPlan={plan?.name}
            />
          ))}
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              Sign in to subscribe to a plan and unlock all features.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};