interface Props {
  result: any;
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Extracted Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Name</label>
            <p className="text-lg text-gray-800">{result.name || 'N/A'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Aadhaar Number</label>
            <p className="text-lg font-mono text-gray-800">{result.aadhaarNumber || 'N/A'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Date of Birth</label>
            <p className="text-lg text-gray-800">{result.dob || 'N/A'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Gender</label>
            <p className="text-lg text-gray-800">{result.gender || 'N/A'}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Pincode</label>
            <p className="text-lg font-mono text-gray-800">{result.pincode || 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-50 p-3 rounded">
        <label className="block text-sm font-semibold text-gray-600 mb-1">Address</label>
        <p className="text-lg text-gray-800 leading-relaxed">{result.address || 'N/A'}</p>
      </div>
    </div>
  );
};

export default ResultDisplay;