'use client';
import { useState, useRef } from 'react';
import FileInput from './ui/FileInput';
import FormError from './ui/FormError';
import PrimaryButton from './ui/PrimaryButton';
import { ApiService } from '../services/apiService';

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

    if (frontFile.size > 5 * 1024 * 1024 || backFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setLoading(false);
      return;
    }

    try {
      // Create preview URLs
      const frontUrl = URL.createObjectURL(frontFile);
      const backUrl = URL.createObjectURL(backFile);
      setImages({ front: frontUrl, back: backUrl });

      console.log('Sending request via ApiService');
      const response = await ApiService.uploadImages(frontFile, backFile);
      console.log('Response received:', response);
      setOcrResult(response);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to process images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <FileInput label="Front Image" accept="image/jpeg,image/png" inputRef={frontRef} />
      <FileInput label="Back Image" accept="image/jpeg,image/png" inputRef={backRef} />
      <FormError error={error} />
      <PrimaryButton type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Upload & Process'}
      </PrimaryButton>
    </form>
  );
};

export default UploadForm;