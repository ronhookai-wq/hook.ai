# Frontend Integration Guide

This guide shows how to integrate the backend services with the Hook.ai frontend.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Ensure your `.env` file has:
```
VITE_SUPABASE_URL=https://frpjdlksccqgffyawmmg.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Wrap App with AuthProvider

Update your main entry point (index.tsx):

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './lib/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

## Update AuthModal Component

Replace the mock authentication in `components/AuthModal.tsx`:

```tsx
import React, { useState } from 'react';
import { GoogleIcon, FacebookIcon, InstagramIcon, XIcon } from './icons';
import { signUp, signIn, signInWithGoogle, signInWithFacebook } from '../lib/api';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        alert('Check your email for verification link!');
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleFacebookSignIn = async () => {
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
          <p className="text-gray-400 mb-6">Sign in to unlock your creativity.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={handleGoogleSignIn} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <GoogleIcon />
          </button>
          <button onClick={handleFacebookSignIn} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
            <FacebookIcon />
          </button>
        </div>

        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

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

          <div className="flex flex-col space-y-3">
            <button
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
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
```

## Update App Component

Update `App.tsx` to use real authentication:

```tsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratePage from './components/GeneratePage';
import UploadPage from './components/UploadPage';
import PricingPage from './components/PricingPage';
import AuthModal from './components/AuthModal';
import { User } from './types';
import { useAuth } from './lib/AuthContext';
import { signOut } from './lib/api';

type Page = 'generate' | 'upload' | 'pricing';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('generate');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [imageForEditing, setImageForEditing] = useState<string | null>(null);
  const { user, userData, loading } = useAuth();

  const userState: User = {
    isLoggedIn: !!user,
    isSubscribed: userData?.subscription?.isSubscribed || false,
    subscriptionTier: (userData?.subscription?.tier as any) || 'Free Trial',
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSendToEditor = (imageSrc: string) => {
    setImageForEditing(imageSrc);
    setActivePage('upload');
  };

  const handleClearInitialImage = () => {
    setImageForEditing(null);
  };

  const renderPage = () => {
    if (!user) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to Hook.ai</h2>
            <p className="text-gray-400 mb-6">Sign in to start creating amazing images</p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      );
    }

    switch (activePage) {
      case 'generate':
        return <GeneratePage user={userState} onUpgrade={() => setActivePage('pricing')} onSendToEditor={handleSendToEditor} />;
      case 'upload':
        return <UploadPage user={userState} onUpgrade={() => setActivePage('pricing')} initialImage={imageForEditing} onClearInitialImage={handleClearInitialImage} />;
      case 'pricing':
        return <PricingPage />;
      default:
        return <GeneratePage user={userState} onUpgrade={() => setActivePage('pricing')} onSendToEditor={handleSendToEditor} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header
        activePage={activePage}
        setActivePage={(page) => {
          if (page !== 'upload') {
            handleClearInitialImage();
          }
          setActivePage(page);
        }}
        onSignInClick={() => user ? handleSignOut() : setIsAuthModalOpen(true)}
        isLoggedIn={!!user}
      />
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default App;
```

## Update Header Component

Update `components/Header.tsx` to show sign out option:

```tsx
interface HeaderProps {
  activePage: string;
  setActivePage: (page: 'generate' | 'upload' | 'pricing') => void;
  onSignInClick: () => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ activePage, setActivePage, onSignInClick, isLoggedIn }) => {
  // ... existing code ...

  <button
    onClick={onSignInClick}
    className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-all transform hover:scale-105"
  >
    {isLoggedIn ? 'Sign Out' : 'Sign In / Sign Up'}
  </button>

  // ... rest of component
}
```

## Track Usage in Generate/Upload Pages

Update `components/GeneratePage.tsx` to track usage:

```tsx
import { trackUsage } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const GeneratePage: React.FC<GeneratePageProps> = ({ user, onUpgrade, onSendToEditor }) => {
  const { refreshUserData } = useAuth();

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);
    setImageStates([initialImageState, initialImageState]);

    try {
      const results = await Promise.all([
        generateImage(prompt, style, aspectRatio),
        generateImage(prompt, style, aspectRatio)
      ]);

      // Track usage for both images
      await Promise.all([
        trackUsage({
          operationType: 'generate',
          imageUrl: results[0],
          prompt,
          style,
          aspectRatio,
        }),
        trackUsage({
          operationType: 'generate',
          imageUrl: results[1],
          prompt,
          style,
          aspectRatio,
        }),
      ]);

      // Refresh user data to update limits display
      await refreshUserData();

      setImageStates([
        { ...initialImageState, src: results[0] },
        { ...initialImageState, src: results[1] }
      ]);
    } catch (err: any) {
      if (err.message.includes('Monthly limit reached')) {
        setError('You have reached your monthly limit. Please upgrade to continue.');
      } else {
        setError('Failed to generate images. Please try again.');
      }
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Similar updates for handleMagicEditSubmit, handleUpscale, etc.
};
```

## Display Usage Information

Create a new component to show usage stats:

```tsx
// components/UsageDisplay.tsx
import React from 'react';
import { useAuth } from '../lib/AuthContext';

const UsageDisplay: React.FC = () => {
  const { userData } = useAuth();

  if (!userData) return null;

  const { usage, limits } = userData;
  const percentage = (usage.thumbnails_generated / limits.thumbnailsPerMonth) * 100;

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">Monthly Usage</span>
        <span className="text-sm font-semibold">
          {usage.thumbnails_generated} / {limits.thumbnailsPerMonth}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-cyan-500 h-2 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default UsageDisplay;
```

## Update PricingPage with Real Checkout

```tsx
import { createCheckoutSession } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      alert('Please sign in to subscribe');
      return;
    }

    if (!plan.stripe_price_id) {
      alert('Coming soon!');
      return;
    }

    setLoading(plan.name);
    try {
      const { url } = await createCheckoutSession(plan.id, plan.stripe_price_id);
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Update button in the map:
  <button
    onClick={() => handleSubscribe(plan)}
    disabled={loading === plan.name}
    className={`w-full mt-10 py-3 px-6 rounded-lg font-semibold transition-transform transform hover:scale-105 ${
      plan.name === 'Pro'
      ? 'bg-cyan-600 text-white hover:bg-cyan-700'
      : 'bg-gray-700 text-white hover:bg-gray-600'
    }`}
  >
    {loading === plan.name ? 'Loading...' : plan.cta}
  </button>
};
```

## Complete!

Your Hook.ai application now has:
- Real authentication with email/password and OAuth
- Automatic user profile creation
- Free trial subscription on signup
- Usage tracking and limit enforcement
- Stripe checkout integration (ready for production)
- Protected routes and data access

Remember to configure OAuth providers in Supabase Dashboard and set up Stripe in production.
