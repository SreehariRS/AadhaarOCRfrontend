import { RefObject, useState, useRef } from 'react';

interface Props {
  label: string;
  accept: string;
  inputRef: RefObject<HTMLInputElement>;
}

const FileInput: React.FC<Props> = ({ label, accept, inputRef }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && inputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(files[0]);
      inputRef.current.files = dataTransfer.files;
      setSelectedFile(files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file ? file.name : null);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-3 text-gray-800">
        {label}
      </label>
      
      <div
        ref={containerRef}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer transition-all duration-300 ease-in-out
          border-2 border-dashed rounded-xl p-8
          bg-gradient-to-br from-gray-50 to-gray-100
          hover:from-blue-50 hover:to-indigo-50
          hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100
          ${isDragOver 
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg shadow-blue-200 scale-[1.02]' 
            : 'border-gray-300'
          }
          ${selectedFile 
            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
            : ''
          }
        `}
      >
        <div className="text-center">
          {selectedFile ? (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                {selectedFile}
              </p>
              <p className="text-xs text-green-600">
                Click to choose a different file
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-base font-medium text-gray-700 mb-1">
                  {isDragOver ? 'Drop your file here' : 'Choose a file or drag it here'}
                </p>
                <p className="text-sm text-gray-500">
                  {accept.split(',').map(type => type.trim().replace('.', '').toUpperCase()).join(', ')} files
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Animated border effect */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-pulse pointer-events-none" />
        )}
      </div>

      <input
        type="file"
        accept={accept}
        ref={inputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileInput;