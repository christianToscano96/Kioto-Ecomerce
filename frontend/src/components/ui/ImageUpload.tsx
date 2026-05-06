import { useState } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  label?: string;
  currentImage?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  endpoint?: 'image' | 'category-image';
}

export function ImageUpload({ 
  label, 
  currentImage, 
  onUpload, 
  onRemove,
  endpoint = 'image'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/upload/${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload');

      const data = await response.json();
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-on-surface-variant">
        {label}
      </label>

      {currentImage ? (
        <div className="relative inline-block">
          <img
            src={currentImage}
            alt="Preview"
            className="h-24 w-24 object-cover rounded-lg border border-outline-variant"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-terracota-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-terracota-600"
            title="Eliminar"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`upload-${label}`}
            disabled={isUploading}
          />
          <label
            htmlFor={`upload-${label}`}
            className="cursor-pointer px-4 py-2 rounded-lg border border-outline-variant text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
          >
            {isUploading ? 'Subiendo...' : 'Seleccionar imagen'}
          </label>
        </div>
      )}

      {error && (
        <span className="text-sm text-terracota-600">{error}</span>
      )}
    </div>
  );
}