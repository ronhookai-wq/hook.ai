import React from 'react';
import { User } from '../types';
import { LockIcon } from './icons';

interface ImageActionsProps {
  src: string | null;
  isProcessing: boolean;
  onMagicEdit?: () => void;
  onUpscale?: () => void;
  onRemoveBackground?: () => void;
  onAddText?: () => void;
  onDownload?: () => void;
  user: User;
}

const ImageActions: React.FC<ImageActionsProps> = ({
  src, isProcessing, onMagicEdit, onUpscale, onRemoveBackground, onAddText, onDownload, user
}) => {
  // Render a placeholder if no image, to prevent layout shifts
  if (!src || isProcessing) {
    return <div className="h-12" />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <div className="flex gap-2 p-1 bg-gray-800 rounded-md shadow-md">
        {onUpscale && (
          <button onClick={onUpscale} className="text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors">
            Upscale
          </button>
        )}
        {onRemoveBackground && (
          <button onClick={onRemoveBackground} className="text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors">
            Remove BG
          </button>
        )}
        {onMagicEdit && (
          <button
            onClick={onMagicEdit}
            className="relative text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors flex items-center gap-1"
          >
            {!user.isSubscribed && <LockIcon />}
            Magic Edit
          </button>
        )}
        {onAddText && (
          <button onClick={onAddText} className="text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-700 transition-colors">
            Add Text
          </button>
        )}
        {onDownload && (
          <button onClick={onDownload} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors">
            Download
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageActions;