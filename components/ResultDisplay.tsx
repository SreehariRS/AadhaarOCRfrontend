import { useState } from 'react';

interface Props {
  result: any;
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoCard = ({ 
    icon, 
    label, 
    value, 
    copyable = false, 
    fieldKey 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    copyable?: boolean; 
    fieldKey: string; 
  }) => (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <label className="text-sm font-semibold text-gray-700">{label}</label>
        </div>
        {copyable && value && value !== 'N/A' && (
          <button
            onClick={() => copyToClipboard(value, fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600"
            title="Copy to clipboard"
          >
            {copiedField === fieldKey ? (
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
      <div className="pl-11">
        <p className={`text-lg font-medium ${value === 'N/A' ? 'text-gray-400 italic' : 'text-gray-900'} ${fieldKey === 'aadhaar' || fieldKey === 'pincode' ? 'font-mono tracking-wider' : ''}`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Extracted Information</h2>
            <p className="text-blue-100 text-sm">Aadhaar Document Analysis</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-2xl p-6 shadow-lg">
        {/* Personal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Full Name"
              value={result.name}
              copyable={true}
              fieldKey="name"
            />
            <InfoCard
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-9 0h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
              }
              label="Gender"
              value={result.gender}
              fieldKey="gender"
            />
            <InfoCard
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-9 0h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                </svg>
              }
              label="Date of Birth"
              value={result.dob}
              copyable={true}
              fieldKey="dob"
            />
            <InfoCard
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              }
              label="Aadhaar Number"
              value={result.aadhaarNumber}
              copyable={true}
              fieldKey="aadhaar"
            />
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
            Location Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              label="Pincode"
              value={result.pincode}
              copyable={true}
              fieldKey="pincode"
            />
            <div className="md:col-span-2">
              <InfoCard
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
                label="Address"
                value={result.address}
                copyable={true}
                fieldKey="address"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Information extracted successfully</span>
            </div>
            <span>Click on copy icons to copy values</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;