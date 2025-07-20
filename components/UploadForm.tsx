'use client';
import axios from 'axios';
import { useState, useRef } from 'react';
import FileInput from './ui/FileInput';

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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Upload Aadhaar Documents</h2>
          <p className="text-blue-100 text-sm">
            Please upload clear images of both front and back sides of your Aadhaar card
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Front Image Upload */}
            <FileInput
              label="📄 Aadhaar Front Side"
              accept="image/jpeg,image/png"
              inputRef={frontRef}
            />

            {/* Back Image Upload */}
            <FileInput
              label="📄 Aadhaar Back Side"
              accept="image/jpeg,image/png"
              inputRef={backRef}
            />

            {/* Error Message */}
            {error && (
              <div className="relative">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full relative overflow-hidden
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700
                  disabled:from-gray-400 disabled:to-gray-500
                  text-white font-semibold py-4 px-6 rounded-xl
                  transform transition-all duration-200 ease-in-out
                  hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-200
                  disabled:scale-100 disabled:shadow-none
                  focus:outline-none focus:ring-4 focus:ring-blue-200
                  ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Processing Documents...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                      </svg>
                      <span>Extract Information</span>
                    </>
                  )}
                </div>
                
                {/* Animated background effect */}
                {!loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 transition-all duration-700 -translate-x-full hover:translate-x-full" />
                )}
              </button>
            </div>

            {/* Info Section */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">Upload Guidelines</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Supported formats: JPEG, PNG</li>
                    <li>• Maximum file size: 5MB per image</li>
                    <li>• Ensure images are clear and well-lit</li>
                    <li>• Upload valid Aadhaar card front and back images</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;