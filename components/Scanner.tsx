import React, { useState } from 'react';

// 1. Define Props Interface to fix "IntrinsicAttributes" error
interface ScannerProps {
  user: any;
  onLoginRequired: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ user, onLoginRequired }) => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    // 2. Instead of a boring alert, trigger the modern login popup
    if (!user) {
      onLoginRequired();
      return;
    }
    
    if (!symptoms) return alert("Please describe your symptoms.");
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Passes user email so MongoDB saves it to the right profile
        body: JSON.stringify({ 
            symptomData: symptoms, 
            userEmail: user.email 
        }), 
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Hospital Server is not responding. Ensure Terminal 1 is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">AI Health Diagnostic</h2>
        {/* Only show the verified email if the user is actually logged in */}
        {user ? (
          <p className="text-green-500 font-medium">Account: {user.email}</p>
        ) : (
          <p className="text-blue-500 font-medium">Powered by HexaCare Neural Engine</p>
        )}
      </div>

      <textarea
        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition-colors h-32 text-gray-700"
        placeholder="e.g., 'I have a persistent cough and high fever...'"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleScan}
        disabled={loading}
        className={`w-full mt-6 py-4 rounded-xl text-white font-bold transition-all shadow-lg active:scale-[0.98] ${
          loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-blue-200'
        }`}
      >
        {loading ? "AI is Analyzing..." : user ? "Run Analysis" : "Sign in to Run Analysis"}
      </button>

      {result && result.status === "success" && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 animate-in fade-in slide-in-from-bottom duration-500">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Diagnosis: {result.prediction}</h3>
          <p className="text-gray-700 mb-4"><strong>Recommendation:</strong> {result.recommendation}</p>
          <div className="text-[10px] text-gray-400 font-mono border-t border-blue-200 pt-2 uppercase">
             Secure Ledger Hash: {result.blockchainHash}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;