import React from 'react';
import { AspectRatio, ImageStyle, User, TextOverlay } from '../types';
import { ASPECT_RATIOS, STYLES, FONT_FACES } from '../constants';

interface ControlPanelProps {
  isGeneratePage: boolean;
  prompt: string;
  setPrompt: (p: string) => void;
  style: ImageStyle;
  setStyle: (s: ImageStyle) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  onGenerate?: () => void;
  onFileUpload?: (file: File) => void;
  onRedoUpload?: () => void;
  isProcessing: boolean;
  user: User;
  onUpgrade: () => void;
  // New props for controlled text editing on Upload page
  selectedText?: TextOverlay | null;
  onUpdateText?: (id: number, props: Partial<TextOverlay>) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isGeneratePage,
  prompt, setPrompt,
  style, setStyle,
  aspectRatio, setAspectRatio,
  onGenerate,
  onFileUpload, onRedoUpload, isProcessing, user, onUpgrade,
  selectedText, onUpdateText
}) => {

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
  };
  
  const renderTypographyControls = () => {
    if (isGeneratePage || !selectedText || !onUpdateText) return null;

    return (
        <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Typography</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Font Family</label>
                    <select 
                        value={selectedText.fontFamily} 
                        onChange={(e) => onUpdateText(selectedText.id, { fontFamily: e.target.value })} 
                        className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    >
                        {FONT_FACES.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Color</label>
                    <input 
                        type="color" 
                        value={selectedText.color}
                        onChange={(e) => onUpdateText(selectedText.id, { color: e.target.value })}
                        className="w-full h-10 p-1 bg-gray-900 border border-gray-700 rounded-md cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg h-full flex flex-col gap-6 overflow-y-auto">
      {isGeneratePage ? (
        <>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cinematic shot of a robot holding a red skateboard"
              className="w-full h-24 p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Style</label>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  disabled={isProcessing}
                  className={`py-2 px-1 text-xs rounded-md transition-colors ${style === s ? 'bg-cyan-600 text-white font-semibold' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Aspect Ratio</label>
            <div className="flex gap-2">
              {ASPECT_RATIOS.map(ar => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  disabled={isProcessing}
                  className={`flex-1 py-2 rounded-md transition-colors ${aspectRatio === ar ? 'bg-cyan-600 text-white font-semibold' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onGenerate} disabled={isProcessing || !prompt} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? 'Generating...' : 'Generate'}
          </button>
        </>
      ) : (
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">Upload Image</label>
          <div className="flex flex-col gap-3">
            <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isProcessing} />
            <label htmlFor="file-upload" className="w-full text-center bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Choose an Image
            </label>
            <button onClick={onRedoUpload} disabled={isProcessing} className="w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Redo Upload
            </button>
          </div>
        </div>
      )}
      
      {renderTypographyControls()}
    </div>
  );
};

export default ControlPanel;
