// components/Scanner.tsx
import React, { useState } from 'react';

const Scanner = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<any>(null); // Use <any> to ignore TS warnings for now
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!symptoms) return alert("Please enter symptoms first.");
    
    setLoading(true);
    setResult(null);

    try {
      // THIS connects to the server you just built!
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptomData: symptoms, userType: 'guest' }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Server is not running! Did you run 'node server.js'?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">AI Health Diagnostic</h2>
        <p className="text-blue-500">Powered by HexaCare Neural Engine</p>
      </div>

      <textarea
        className="w-full p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:outline-none transition-colors h-32 text-gray-700"
        placeholder="Describe your symptoms (e.g., 'I have a throbbing headache and sensitivity to light...')"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <button
        onClick={handleScan}
        disabled={loading}
        className={`w-full mt-6 py-4 rounded-xl text-white font-bold text-lg transition-all ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        {loading ? "AI is Analyzing..." : "Run Analysis"}
      </button>

      {/* RESULTS DISPLAY AREA */}
      {result && (
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-900">Analysis Results</h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Risk Score: {result.riskScore}%
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">{result.analysis}</p>
          <div className="text-xs text-gray-400 font-mono break-all border-t border-blue-200 pt-2">
            BLOCKCHAIN VERIFICATION HASH: <br/> {result.blockchainHash}
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;