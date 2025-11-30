import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextOverlay } from '../types';
import { TrashIcon } from './icons';
import { FONT_FACES } from '../constants';

interface ImagePreviewProps {
  src: string | null;
  isLoading: boolean;
  aspectRatio: string;
  width?: string;
  textOverlays: TextOverlay[];
  onTextOverlaysChange: (overlays: TextOverlay[]) => void;
  selectedTextId: number | null;
  onSelectedTextIdChange: (id: number | null) => void;
  actionButtons?: React.ReactNode;
  processingOperation?: string | null;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const TextComponent: React.FC<{
  textOverlay: TextOverlay;
  isSelected: boolean;
  onSelect: (id: number | null) => void;
  onUpdate: (id: number, newProps: Partial<TextOverlay>) => void;
  onDelete: (id: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ textOverlay, isSelected, onSelect, onUpdate, onDelete, containerRef }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(textOverlay.text);
  const textRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef({
    type: null as 'move' | 'resize' | null,
    startX: 0,
    startY: 0,
    startRotation: 0,
    startScale: 0,
    startXPercent: 0,
    startYPercent: 0,
  });
  const finalUpdate = useRef<Partial<TextOverlay>>({});

  useEffect(() => {
    // Sync local state with prop changes, but only when not actively editing.
    // This prevents prop updates from overwriting user input.
    if (!isEditing) {
        setEditedText(textOverlay.text);
    }
  }, [textOverlay.text, isEditing]);

  const handleTextUpdate = () => {
    onUpdate(textOverlay.id, { text: editedText });
    setIsEditing(false);
  };

  const handleInteractionMove = useCallback((e: MouseEvent) => {
    const { type, startX, startY, startXPercent, startYPercent, startScale, startRotation } = interactionRef.current;
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!type || !container || !textEl) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (type === 'move') {
        const dxPercent = (dx / container.offsetWidth) * 100;
        const dyPercent = (dy / container.offsetHeight) * 100;
        const newX = Math.max(0, Math.min(100, startXPercent + dxPercent));
        const newY = Math.max(0, Math.min(100, startYPercent + dyPercent));
        
        textEl.style.left = `${newX}%`;
        textEl.style.top = `${newY}%`;

        finalUpdate.current = { ...finalUpdate.current, x: newX, y: newY };

    } else if (type === 'resize') {
        const containerRect = container.getBoundingClientRect();
        
        const elementCenterX = containerRect.left + (startXPercent / 100) * container.offsetWidth;
        const elementCenterY = containerRect.top + (startYPercent / 100) * container.offsetHeight;

        const startVecX = startX - elementCenterX;
        const startVecY = startY - elementCenterY;
        const currentVecX = e.clientX - elementCenterX;
        const currentVecY = e.clientY - elementCenterY;

        const startDist = Math.sqrt(startVecX * startVecX + startVecY * startVecY);
        const currentDist = Math.sqrt(currentVecX * currentVecX + currentVecY * currentVecY);
        
        const scaleFactor = startDist > 0 ? currentDist / startDist : 1;
        const newScale = Math.max(0.1, startScale * scaleFactor);
        
        const startAngle = Math.atan2(startVecY, startVecX);
        const currentAngle = Math.atan2(currentVecY, currentVecX);

        const angleDiff = currentAngle - startAngle;
        const newRotation = startRotation + (angleDiff * (180 / Math.PI));
        
        textEl.style.transform = `translate(-50%, -50%) rotate(${newRotation}deg) scale(${newScale})`;

        finalUpdate.current = { ...finalUpdate.current, scale: newScale, rotation: newRotation };
    }
  }, [containerRef]);

  const handleInteractionEnd = useCallback(() => {
    if (interactionRef.current.type && Object.keys(finalUpdate.current).length > 0) {
      onUpdate(textOverlay.id, finalUpdate.current);
    }
    finalUpdate.current = {};
    interactionRef.current.type = null;
    window.removeEventListener('mousemove', handleInteractionMove);
    window.removeEventListener('mouseup', handleInteractionEnd);
  }, [onUpdate, textOverlay.id, handleInteractionMove]);
  
  const handleInteractionStart = (e: React.MouseEvent, type: 'move' | 'resize') => {
    // Do not prevent default, as it blocks the onDoubleClick event.
    // CSS `user-select: none` will prevent text selection during drag.
    e.stopPropagation();
    onSelect(textOverlay.id);
    interactionRef.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startRotation: textOverlay.rotation,
      startScale: textOverlay.scale,
      startXPercent: textOverlay.x,
      startYPercent: textOverlay.y,
    };
    window.addEventListener('mousemove', handleInteractionMove);
    window.addEventListener('mouseup', handleInteractionEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
    };
  }, [handleInteractionMove, handleInteractionEnd]);

  return (
    <div
      ref={textRef}
      style={{
        position: 'absolute',
        left: `${textOverlay.x}%`,
        top: `${textOverlay.y}%`,
        transform: `translate(-50%, -50%) rotate(${textOverlay.rotation}deg) scale(${textOverlay.scale})`,
        cursor: isSelected ? 'move' : 'pointer',
        userSelect: 'none',
        padding: '8px',
        border: isSelected ? '2px dashed rgb(0, 200, 255)' : 'none',
        transformOrigin: 'center center',
      }}
      onMouseDown={(e) => handleInteractionStart(e, 'move')}
      onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
      onClick={(e) => { e.stopPropagation(); onSelect(textOverlay.id); }}
    >
      {isEditing ? (
        <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleTextUpdate}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextUpdate(); } }}
            className="bg-transparent text-white border-none outline-none resize-none"
            style={{ color: textOverlay.color, fontFamily: textOverlay.fontFamily, textAlign: 'center', minWidth: '50px' }}
            autoFocus
        />
      ) : (
        <span style={{ color: textOverlay.color, fontFamily: textOverlay.fontFamily, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {textOverlay.text}
        </span>
      )}
      
      {isSelected && (
        <>
          <div
            className="absolute -bottom-5 -right-5 w-6 h-6 bg-cyan-500 rounded-full cursor-grab active:cursor-grabbing border-2 border-gray-900"
            style={{ transform: `rotate(${-textOverlay.rotation}deg)` }}
            onMouseDown={(e) => handleInteractionStart(e, 'resize')}
            title="Drag to resize and rotate"
          ></div>
          <div 
            className="absolute flex items-center gap-2 p-1.5 bg-gray-800 rounded-md shadow-lg z-10"
            style={{ top: '-50px', left: '50%', transform: `translateX(-50%) rotate(${-textOverlay.rotation}deg)` }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input type="color" value={textOverlay.color} onChange={(e) => onUpdate(textOverlay.id, { color: e.target.value })} className="w-6 h-6 p-0 border-none rounded cursor-pointer bg-transparent" />
            <select value={textOverlay.fontFamily} onChange={(e) => onUpdate(textOverlay.id, { fontFamily: e.target.value })} className="bg-gray-700 text-white text-xs rounded border-none focus:ring-0">
                {FONT_FACES.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
            <button onClick={() => onDelete(textOverlay.id)} className="p-1 hover:bg-gray-600 rounded">
              <TrashIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};


const ImagePreview: React.FC<ImagePreviewProps> = ({
  src, isLoading, aspectRatio, width = 'w-full',
  textOverlays, onTextOverlaysChange,
  selectedTextId, onSelectedTextIdChange,
  actionButtons,
  processingOperation = null,
  isExpanded: externalIsExpanded,
  onExpandedChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = onExpandedChange || setInternalIsExpanded;

  const updateTextOverlay = (id: number, newProps: Partial<TextOverlay>) => {
      onTextOverlaysChange(
        textOverlays.map(o => o.id === id ? { ...o, ...newProps } : o)
      );
  };

  const deleteTextOverlay = (id: number) => {
    onTextOverlaysChange(textOverlays.filter(o => o.id !== id));
  };

  const deselectText = () => onSelectedTextIdChange(null);

  const handleImageClick = (e: React.MouseEvent) => {
    if (src && !isLoading) {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    } else {
      deselectText();
    }
  };

  const handleExpandedBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsExpanded(false);
    }
  };

  return (
    <>
    <div
      ref={containerRef}
      className={`relative ${width} aspect-[${aspectRatio.replace(':', '/')}] bg-gray-800 rounded-lg overflow-hidden shadow-lg group`}
      onClick={handleImageClick}
    >
      {(isLoading || processingOperation) && (
        <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
          {processingOperation && (
            <p className="mt-4 text-white font-medium text-lg">{processingOperation}...</p>
          )}
        </div>
      )}
      {!isLoading && !src && (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Image Preview</p>
          </div>
        </div>
      )}
      {src && (
        <>
          <img src={src} alt="Generated or uploaded content" className="w-full h-full object-cover cursor-pointer" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-black/70 px-4 py-2 rounded-lg text-white text-sm">
              Click to expand for editing
            </div>
          </div>
        </>
      )}

      {textOverlays.map(overlay => (
        <TextComponent
          key={overlay.id}
          textOverlay={overlay}
          isSelected={selectedTextId === overlay.id}
          onSelect={onSelectedTextIdChange}
          onUpdate={updateTextOverlay}
          onDelete={deleteTextOverlay}
          containerRef={containerRef}
        />
      ))}
    </div>

    {isExpanded && (
      <div
        className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-8"
        onClick={handleExpandedBackdropClick}
      >
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-4 max-w-7xl w-full">
          <div
            ref={expandedContainerRef}
            className={`relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl aspect-[${aspectRatio.replace(':', '/')}]`}
            style={{ maxHeight: '70vh', maxWidth: '90vw' }}
          >
            <img
              src={src || ''}
              alt="Expanded view"
              className="w-full h-full object-cover"
            />

            {processingOperation && (
              <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
                <p className="mt-4 text-white font-medium text-lg">{processingOperation}...</p>
              </div>
            )}

            {textOverlays.map(overlay => (
              <TextComponent
                key={overlay.id}
                textOverlay={overlay}
                isSelected={selectedTextId === overlay.id}
                onSelect={onSelectedTextIdChange}
                onUpdate={updateTextOverlay}
                onDelete={deleteTextOverlay}
                containerRef={expandedContainerRef}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            {actionButtons}
            <div className="bg-black/70 px-4 py-2 rounded-lg text-white text-sm">
              Click outside to close
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ImagePreview;