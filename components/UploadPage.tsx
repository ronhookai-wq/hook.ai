import React, { useState, useEffect } from 'react';
import ControlPanel from './ControlPanel';
import ImagePreview from './ImagePreview';
import ImageActions from './ImageActions';
import MagicEditModal from './MagicEditModal';
import { AspectRatio, ImageStyle, User, TextOverlay } from '../types';
import { magicEdit, upscaleImage, removeBackground } from '../services/geminiService';
import { downloadImage } from '../lib/downloadUtils';
import { useAuth } from '../lib/AuthContext';

interface UploadPageProps {
  user: User;
  onUpgrade: () => void;
  onRequestAuth: () => void;
  initialImage: string | null;
  onClearInitialImage: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ user, onUpgrade, onRequestAuth, initialImage, onClearInitialImage }) => {
  const { user: authUser } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingOperation, setProcessingOperation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(75);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [isMagicEditModalOpen, setIsMagicEditModalOpen] = useState(false);
  
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
      setTextOverlays([]);
      setSelectedTextId(null);
    }
  }, [initialImage]);

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    onClearInitialImage(); // Clear initial image if a new one is uploaded
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setTextOverlays([]);
      setSelectedTextId(null);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRedoUpload = () => {
      setImage(null);
      setTextOverlays([]);
      setSelectedTextId(null);
      onClearInitialImage();
  }

  const handleMagicEditSubmit = async (editPrompt: string) => {
    if (!image) return;

    setIsProcessing(true);
    setProcessingOperation('Magic Edit');
    setIsMagicEditModalOpen(false);
    try {
      const result = await magicEdit(image, editPrompt);
      setImage(result);
      if (!user.isSubscribed) {
        alert("Magic Edit applied! Upgrade to a Pro plan to download your creation without a watermark.");
      }
    } catch (err) {
      setError('Magic Edit failed.');
    } finally {
      setIsProcessing(false);
      setProcessingOperation(null);
    }
  };

  const handleUpscale = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProcessingOperation('Upscaling');
    try {
      const result = await upscaleImage(image);
      setImage(result);
    } catch (err) {
      setError('Upscale failed.');
    } finally {
      setIsProcessing(false);
      setProcessingOperation(null);
    }
  };

  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProcessingOperation('Removing Background');
    try {
      const result = await removeBackground(image);
      setImage(result);
    } catch (err) {
      setError('Background removal failed.');
    } finally {
      setIsProcessing(false);
      setProcessingOperation(null);
    }
  };

  const handleAddText = () => {
    const newText: TextOverlay = {
      id: Date.now(),
      text: 'Editable Text',
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      color: '#FFFFFF',
      fontFamily: 'Inter',
    };
    setTextOverlays([...textOverlays, newText]);
    setSelectedTextId(newText.id);
  };

  const handleDownload = async () => {
    if (!image) return;

    if (!authUser) {
      onRequestAuth();
      return;
    }

    try {
      await downloadImage(image, `hook-ai-thumbnail-${Date.now()}.png`);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download image');
    }
  };

  const openMagicEditModal = () => {
    if (!image) return;

    if (!user.isSubscribed) {
      alert("Magic Edit is a premium feature. Upgrade to a Pro plan to unlock it!");
      return;
    }

    setIsMagicEditModalOpen(true);
  };

  const handleUpdateText = (id: number, props: Partial<TextOverlay>) => {
    setTextOverlays(current => current.map(o => o.id === id ? {...o, ...props} : o));
  };

  const selectedText = textOverlays.find(t => t.id === selectedTextId) || null;

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6 p-6 bg-gray-900" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(87, 4, 120, 0.1), transparent 40%)' }}>
      <div className="w-full lg:w-96 flex-shrink-0">
        <ControlPanel
          isGeneratePage={false}
          prompt={''} setPrompt={() => {}}
          style={ImageStyle.Realistic} setStyle={() => {}}
          aspectRatio={AspectRatio.SixteenNine} setAspectRatio={() => {}}
          onFileUpload={handleFileUpload}
          onRedoUpload={handleRedoUpload}
          isProcessing={isProcessing}
          user={user}
          onUpgrade={onUpgrade}
          selectedText={selectedText}
          onUpdateText={handleUpdateText}
        />
      </div>
      <div className="flex-grow flex flex-col gap-4 items-center justify-center">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div style={{ width: `${imageSize}%` }}>
            <ImagePreview
                src={image}
                isLoading={isProcessing}
                aspectRatio="16:9"
                textOverlays={textOverlays}
                onTextOverlaysChange={setTextOverlays}
                selectedTextId={selectedTextId}
                onSelectedTextIdChange={setSelectedTextId}
                processingOperation={processingOperation}
                actionButtons={
                  <ImageActions
                    src={image}
                    isProcessing={isProcessing}
                    user={user}
                    onAddText={handleAddText}
                    onMagicEdit={openMagicEditModal}
                    onUpscale={handleUpscale}
                    onRemoveBackground={handleRemoveBackground}
                  />
                }
            />
        </div>
        <ImageActions
          src={image}
          isProcessing={isProcessing}
          user={user}
          onAddText={handleAddText}
          onMagicEdit={openMagicEditModal}
          onUpscale={handleUpscale}
          onRemoveBackground={handleRemoveBackground}
          onDownload={handleDownload}
        />
        <div className="w-full max-w-lg px-4">
            <label htmlFor="size-slider" className="block mb-2 text-sm font-medium text-gray-400">Preview Size</label>
            <input
                id="size-slider"
                type="range"
                min="25"
                max="100"
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                disabled={!image}
            />
        </div>
      </div>
      <MagicEditModal 
        isOpen={isMagicEditModalOpen}
        onClose={() => setIsMagicEditModalOpen(false)}
        onSubmit={handleMagicEditSubmit}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default UploadPage;