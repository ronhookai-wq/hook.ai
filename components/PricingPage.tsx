
import React from 'react';
import { PRICING_PLANS } from '../constants';
import { CheckIcon } from './icons';

const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Choose a plan that's right for you.
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Start for free, then upgrade to unlock powerful features.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, index) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-8 flex flex-col transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                plan.name === 'Pro' 
                ? 'border-cyan-500 bg-gray-800 shadow-cyan-500/20' 
                : 'border-gray-700 bg-gray-800/50'
              }`}
            >
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-4 text-gray-400">{plan.bestFor}</p>
              <div className="mt-6">
                <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                <span className="text-base font-medium text-gray-400">/ month</span>
              </div>
              <p className="mt-1 text-gray-400 text-sm">{typeof plan.thumbnails === 'number' ? `${plan.thumbnails} thumbnails` : plan.thumbnails}</p>
              
              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckIcon />
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-10 py-3 px-6 rounded-lg font-semibold transition-transform transform hover:scale-105 ${
                  plan.name === 'Pro' 
                  ? 'bg-cyan-600 text-white hover:bg-cyan-700' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
