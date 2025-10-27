import React, { useState, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { SparklesIcon } from './icons/SparklesIcon';

const PhotoEditorView: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
      setError(null);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImageFile || !prompt.trim()) {
      setError('Please upload an image and enter an editing prompt.');
      return;
    }
    setLoading(true);
    setError(null);
    setEditedImageUrl(null);
    try {
      const resultUrl = await editImage(originalImageFile, prompt);
      setEditedImageUrl(resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setLoading(false);
    }
  }, [originalImageFile, prompt]);
  
  const ImagePlaceholder: React.FC<{ onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; children?: React.ReactNode; className?: string }> = ({ onUpload, children, className }) => (
    <div className={`relative flex flex-col items-center justify-center w-full h-80 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center ${className}`}>
      {children}
      {!children && (
        <>
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
        </>
      )}
      <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight sm:text-5xl">AI Photo Editor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          Upload your travel photos and use simple text prompts to edit them with the magic of AI.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Original Image</h3>
            {originalImageUrl ? (
              <img src={originalImageUrl} alt="Original" className="w-full h-80 object-contain rounded-lg bg-gray-100" />
            ) : (
              <ImagePlaceholder onUpload={handleImageUpload} />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Edited Image</h3>
            {editedImageUrl ? (
                <img src={editedImageUrl} alt="Edited" className="w-full h-80 object-contain rounded-lg bg-gray-100" />
            ) : (
              <div className="flex items-center justify-center w-full h-80 bg-gray-100 rounded-lg">
                {loading ? <Spinner size="lg" /> : <p className="text-gray-500">Your edited image will appear here</p>}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Editing Prompt
          </label>
          <div className="flex items-center gap-2">
             <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a retro filter' or 'Make the sky dramatic'"
              className="flex-grow w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              disabled={loading || !originalImageFile}
            />
            <Button onClick={handleGenerate} disabled={loading || !originalImageFile || !prompt.trim()} className="shrink-0">
                {loading ? <Spinner /> : <><SparklesIcon className="w-5 h-5 mr-2" /> Generate</>}
            </Button>
          </div>
        </div>
        {error && <p className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      </div>
    </div>
  );
};

export default PhotoEditorView;
