"use client";

import { useState } from 'react';
import { isFarcasterContext } from '@/lib/sdk';

export default function VotingButton({ memeId }: { memeId: string }) {
  const [message, setMessage] = useState('');

  const handleVote = async () => {
    if (!isFarcasterContext()) {
      setMessage('⚠️ Voting only works in Farcaster app');
      return;
    }

    setMessage('🚧 Voting coming soon!');
  };

  return (
    <div>
      <button onClick={handleVote}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        👍 Vote ($0.01 USDC)
      </button>
      {message && <p className="text-sm mt-2 text-center font-medium">{message}</p>}
    </div>
  );
}
