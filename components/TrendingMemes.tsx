"use client";

import { useState, useEffect } from 'react';
import { Meme } from '@/lib/db';
import MemeCard from './MemeCard';

export default function TrendingMemes() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'user' | 'reddit'>('all');

  useEffect(() => {
    fetchMemes();
  }, [filter]);

  const fetchMemes = async () => {
    setLoading(true);
    const params = filter !== 'all' ? `?source=${filter}` : '';
    const response = await fetch(`/api/memes${params}`);
    const data = await response.json();
    if (data.success) {
      setMemes(data.memes);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
          🌐 All Memes
        </button>
        <button onClick={() => setFilter('user')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
          👤 User Created
        </button>
        <button onClick={() => setFilter('reddit')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'reddit' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
          🔴 From Reddit
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading memes...</p>
        </div>
      ) : memes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-xl">No memes yet. Create one! 🚀</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
      )}
    </div>
  );
}
