'use client';
import axios from 'axios';
import { useState, useRef } from 'react';

interface Props {
  setOcrResult: (result: any) => void;
  setImages: (images: { front: string | null; back: string | null }) => void;
}

const UploadForm: React.FC<Props> = ({ setOcrResult, setImages }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const frontFile = frontRef.current?.files?.[0];
    const backFile = backRef.current?.files?.[0];

    if (!frontFile || !backFile) {
      setError('Please upload both front and back images.');
      setLoading(false);
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(frontFile.type) || 
        !['image/jpeg', 'image/png'].includes(backFile.type)) {
      setError('Only JPEG or PNG images are allowed.');
      setLoading(false);
      return;
    }

    // Check file sizes (5MB limit)
    if (frontFile.size > 5 * 1024 * 1024 || backFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('front', frontFile);
    formData.append('back', backFile);

    try {
      // Create preview URLs
      const frontUrl = URL.createObjectURL(frontFile);
      const backUrl = URL.createObjectURL(backFile);
      setImages({ front: frontUrl, back: backUrl });

      console.log('Sending request to /api/upload');
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60 second timeout
      });

      console.log('Response received:', response.data);
      setOcrResult(response.data);
    } catch (err: any) {
      console.error('Upload error:', err);
      
      if (err.response) {
        // Server responded with error status
        setError(err.response.data?.error || 'Server error occurred');
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to process images. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Front Image</label>
        <input 
          type="file" 
          accept="image/jpeg,image/png" 
          ref={frontRef} 
          className="w-full border border-gray-300 rounded px-3 py-2" 
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Back Image</label>
        <input 
          type="file" 
          accept="image/jpeg,image/png" 
          ref={backRef} 
          className="w-full border border-gray-300 rounded px-3 py-2" 
        />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Processing...' : 'Upload & Process'}
      </button>
    </form>
  );
};

export default UploadForm;