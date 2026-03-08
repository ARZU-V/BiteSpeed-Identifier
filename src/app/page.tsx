"use client";
import { useState } from 'react';

// Interfaces for Type Safety
interface ConsolidatedContact {
  primaryContatctId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

interface IdentifyResponse {
  contact: ConsolidatedContact;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<IdentifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIdentify = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/identifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Strict JSON requirement
        body: JSON.stringify({
          email: email || null,
          phoneNumber: phoneNumber || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data: IdentifyResponse = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Bitespeed</h1>
          <p className="mt-2 text-gray-600">Identity Reconciliation Dashboard</p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="mcfly@hillvalley.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="123456"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleIdentify}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'
            }`}
          >
            {loading ? 'Processing...' : 'Identify & Reconcile'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Results View */}
        {result && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Consolidated Identity:</h2>
            <div className="bg-gray-900 rounded-xl p-6 overflow-hidden shadow-lg border border-gray-800">
              <pre className="text-green-400 text-sm font-mono overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}