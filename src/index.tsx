import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './lib/AuthContext';

// OAuth callback handler
function handleAuthCallback() {
  if (window.location.pathname === "/auth/callback") {
    return (
      <div className="text-white flex items-center justify-center min-h-screen">
        Completing login...
      </div>
    );
  }
  return <App />;
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      {handleAuthCallback()}
    </AuthProvider>
  </React.StrictMode>
);
