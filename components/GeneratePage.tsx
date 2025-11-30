import React, { useState } from 'react';
import ControlPanel from './ControlPanel';
import ImagePreview from './ImagePreview';
import ImageActions from './ImageActions';
import MagicEditModal from './MagicEditModal';
import { AspectRatio, ImageStyle, User, TextOverlay } from '../types';
import { generateImage, magicEdit, upscaleImage, removeBackground } from '../services/geminiService';
import { downloadImage } from '../lib/downloadUtils';
import { useAuth } from '../lib/AuthContext';

interface ImageState {
  src: string | null;
  textOverlays: TextOverlay[];
  selectedTextId: number | null;
  isProcessing: boolean;
  processingOperation: string | null;
  isExpanded: boolean;
}

const initialImageState: ImageState = {
  src: null,
  textOverlays: [],
  selectedTextId: null,
  isProcessing: false,
  processingOperation: null,
  isExpanded: false,
};

interface GeneratePageProps {
  user: User;
  onUpgrade: () => void;
  onRequestAuth: () => void;
}

const GeneratePage: React.FC<GeneratePageProps> = ({ user, onUpgrade, onRequestAuth }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.Cinematic);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SixteenNine);
  const [imageStates, setImageStates] = useState<[ImageState, ImageState]>([initialImageState, initialImageState]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMagicEditModalOpen, setIsMagicEditModalOpen] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const { user: authUser } = useAuth();

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);
    setImageStates([
      { ...initialImageState, isProcessing: true, processingOperation: 'Generating Image' },
      { ...initialImageState, isProcessing: true, processingOperation: 'Generating Image' }
    ]);
    try {
      const results = await Promise.all([
        generateImage(prompt, style, aspectRatio),
        generateImage(prompt, style, aspectRatio)
      ]);
      setImageStates([
        { ...initialImageState, src: results[0] },
        { ...initialImageState, src: results[1] }
      ]);
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      setImageStates([initialImageState, initialImageState]);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateImageState = (index: number, updates: Partial<ImageState>) => {
    setImageStates(prev => {
      const newStates = [...prev] as [ImageState, ImageState];
      newStates[index] = { ...newStates[index], ...updates };
      return newStates;
    });
  };

  const openMagicEditModal = (index: number) => {
    const { src } = imageStates[index];
    if (!src) return;

    if (!user.isSubscribed) {
      alert("Magic Edit is a premium feature. Upgrade to a Pro plan to unlock it!");
      return;
    }

    setEditingImageIndex(index);
    setIsMagicEditModalOpen(true);
  };

  const handleMagicEditSubmit = async (editPrompt: string) => {
    if (editingImageIndex === null) return;
    const { src } = imageStates[editingImageIndex];
    if (!src) return;

    updateImageState(editingImageIndex, { isProcessing: true, processingOperation: 'Magic Edit' });
    setIsMagicEditModalOpen(false);
    try {
      const result = await magicEdit(src, editPrompt);
      updateImageState(editingImageIndex, { src: result, isProcessing: false, processingOperation: null });
      if (!user.isSubscribed) {
        alert("Magic Edit applied! Upgrade to a Pro plan to download your creation without a watermark.");
      }
    } catch (err) {
      setError('Magic Edit failed.');
      updateImageState(editingImageIndex, { isProcessing: false, processingOperation: null });
    } finally {
      setEditingImageIndex(null);
    }
  };

  const handleUpscale = async (index: number) => {
    const { src } = imageStates[index];
    if (!src) return;
    updateImageState(index, { isProcessing: true, processingOperation: 'Upscaling' });
    try {
      const result = await upscaleImage(src);
      updateImageState(index, { src: result, isProcessing: false, processingOperation: null });
    } catch (err) {
      setError('Upscale failed.');
      updateImageState(index, { isProcessing: false, processingOperation: null });
    }
  };

  const handleRemoveBackground = async (index: number) => {
    const { src } = imageStates[index];
    if (!src) return;
    updateImageState(index, { isProcessing: true, processingOperation: 'Removing Background' });
    try {
      const result = await removeBackground(src);
      updateImageState(index, { src: result, isProcessing: false, processingOperation: null });
    } catch (err) {
      setError('Background removal failed.');
      updateImageState(index, { isProcessing: false, processingOperation: null });
    }
  };

  const handleAddText = (index: number) => {
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
    setImageStates(prev => {
      const newStates = [...prev] as [ImageState, ImageState];
      const updatedOverlays = [...newStates[index].textOverlays, newText];
      newStates[index] = { ...newStates[index], textOverlays: updatedOverlays, selectedTextId: newText.id };
      return newStates;
    });
  };

  const handleTextChange = (index: number, overlays: TextOverlay[]) => {
    setImageStates(prev => {
      const newStates = [...prev] as [ImageState, ImageState];
      newStates[index] = { ...newStates[index], textOverlays: overlays };
      return newStates;
    });
  };

  const handleSelectText = (index: number, id: number | null) => {
    setImageStates(prev => {
      const newStates = [...prev] as [ImageState, ImageState];
      newStates[index] = { ...newStates[index], selectedTextId: id };
      return newStates;
    });
  };

  const handleExpandedChange = (index: number, isExpanded: boolean) => {
    setImageStates(prev => {
      const newStates = [...prev] as [ImageState, ImageState];
      newStates[index] = { ...newStates[index], isExpanded };
      return newStates;
    });
  };

  const handleDownload = async (index: number) => {
    const { src } = imageStates[index];
    if (!src) return;

    if (!authUser) {
      onRequestAuth();
      return;
    }

    try {
      await downloadImage(src, `hook-ai-thumbnail-${Date.now()}.png`);
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download image');
    }
  };

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6 p-6 bg-gray-900" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(4,120,87,0.1), transparent 40%)' }}>
      <div className="w-full lg:w-96 flex-shrink-0">
        <ControlPanel
          isGeneratePage={true}
          prompt={prompt}
          setPrompt={setPrompt}
          style={style}
          setStyle={setStyle}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onGenerate={handleGenerate}
          isProcessing={isProcessing}
          user={user}
          onUpgrade={onUpgrade}
        />
      </div>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {error && <p className="text-red-500 col-span-full text-center">{error}</p>}
        {imageStates.map((state, index) => {
          const actionButtons = (
            <ImageActions
              src={state.src}
              isProcessing={isProcessing}
              user={user}
              onAddText={() => handleAddText(index)}
              onMagicEdit={() => openMagicEditModal(index)}
              onUpscale={() => handleUpscale(index)}
              onRemoveBackground={() => handleRemoveBackground(index)}
              onDownload={() => handleDownload(index)}
            />
          );

          return (
            <div key={index} className="flex flex-col">
              <ImagePreview
                src={state.src}
                isLoading={(isProcessing && !state.src) || state.isProcessing}
                aspectRatio={aspectRatio}
                textOverlays={state.textOverlays}
                onTextOverlaysChange={(overlays) => handleTextChange(index, overlays)}
                selectedTextId={state.selectedTextId}
                onSelectedTextIdChange={(id) => handleSelectText(index, id)}
                actionButtons={actionButtons}
                processingOperation={state.processingOperation}
                isExpanded={state.isExpanded}
                onExpandedChange={(expanded) => handleExpandedChange(index, expanded)}
              />
              {actionButtons}
            </div>
          );
        })}
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

export default GeneratePage;