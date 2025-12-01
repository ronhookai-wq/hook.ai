import React, { useState } from 'react';
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
  const { user: authUser, userData, loading } = useAuth();

  const user: User = {
    isLoggedIn: !!authUser,
    isSubscribed: userData?.subscription?.isSubscribed || false,
    subscriptionTier: userData?.subscription?.tier || 'Free Trial',
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderPage = () => {
    if (activePage === 'generate') {
      return (
        <div className="flex-grow flex flex-col">
          <div className="max-w-4xl mx-auto px-8 py-12 text-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Welcome to Hook.ai
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              Create stunning YouTube thumbnails with AI-powered image generation
            </p>
            <div className="text-lg text-gray-400 mb-8 space-y-3 max-w-2xl mx-auto">
              <p>
                ✨ <strong className="text-white">Generate 2 variations</strong> with or without typography for A/B testing your YouTube thumbnails
              </p>
              <p>
                🎨 <strong className="text-white">Upload and edit</strong> your own images with advanced editing capabilities
              </p>
              <p>
                🚀 <strong className="text-white">Enhance with AI</strong> - upscale, remove backgrounds, and apply magic edits
              </p>
              <p>
                💡 <strong className="text-white">Multiple styles</strong> including Cinematic, Anime, Realistic, and more
              </p>
            </div>
            <div className="mt-10">
              <button
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Creating Now
              </button>
            </div>
          </div>
          <GeneratePage user={user} onUpgrade={() => setActivePage('pricing')} onRequestAuth={() => setIsAuthModalOpen(true)} />
        </div>
      );
    }

    switch (activePage) {
      case 'upload':
        return <UploadPage user={user} onUpgrade={() => setActivePage('pricing')} onRequestAuth={() => setIsAuthModalOpen(true)} initialImage={null} onClearInitialImage={() => {}} />;
      case 'pricing':
        return <PricingPage />;
      default:
        return <GeneratePage user={user} onUpgrade={() => setActivePage('pricing')} onRequestAuth={() => setIsAuthModalOpen(true)} />;
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
        setActivePage={setActivePage}
        onSignInClick={() => setIsAuthModalOpen(true)}
        isLoggedIn={true}
      />
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
};

export default App;