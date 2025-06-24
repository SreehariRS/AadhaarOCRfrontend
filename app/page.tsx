'use client';

import UploadForm from '../components/UploadForm';
import ResultDisplay from '../components/ResultDisplay';
import { useState } from 'react';

export default function Home() {
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [images, setImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Aadhaar OCR System</h1>
      <UploadForm setOcrResult={setOcrResult} setImages={setImages} />
      {images.front && images.back && (
        <div className="mt-4 flex space-x-4">
          <img src={images.front} alt="Front" className="w-48 h-auto" />
          <img src={images.back} alt="Back" className="w-48 h-auto" />
        </div>
      )}
      {ocrResult && <ResultDisplay result={ocrResult} />}
    </main>
  );
}