import React, { useState, useEffect } from 'react';

interface MagicEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
}

const MagicEditModal: React.FC<MagicEditModalProps> = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPrompt(''); // Reset prompt when modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg m-4 transform transition-all duration-300 scale-95" 
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Magic Edit</h2>
        <p className="text-gray-400 mb-6">Describe the change you want to make to the image. For example, "add sunglasses to the cat" or "make the background a futuristic city".</p>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Change the color of the car to blue"
          className="w-full h-28 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          disabled={isProcessing}
        />

        <div className="flex justify-end gap-4 mt-6">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isProcessing || !prompt.trim()}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MagicEditModal;
