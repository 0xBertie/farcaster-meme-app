"use client";

import { useState } from 'react';
import { sdk, initializeSdk } from '@/lib/sdk';

export default function VotingButton({ memeId }: { memeId: string }) {
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVote = async () => {
    setVoting(true);
    setMessage('');

    try {
      const user = await initializeSdk();
      await sdk.actions.ready();

      // ИСПРАВЛЕНИЕ: используем ethProvider вместо wallet.sendTransaction
      const provider = sdk.wallet.ethProvider;

      // Отправляем транзакцию через eth_sendTransaction
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          to: process.env.NEXT_PUBLIC_PAYMENT_ADDRESS,
          value: '0x2710', // 10000 wei в hex (0.01 USDC)
          chainId: '0x2105', // BASE mainnet
        }],
      });

      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memeId,
          transactionHash: txHash,
          voterFid: user.fid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Vote successful!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage('❌ ' + (data.error || 'Vote failed'));
      }
    } catch (error: any) {
      console.error('Vote error:', error);
      setMessage('❌ ' + (error.message || 'Failed'));
    } finally {
      setVoting(false);
    }
  };

  return (
    <div>
      <button onClick={handleVote} disabled={voting}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 transition-colors">
        {voting ? 'Processing...' : '👍 Vote ($0.01 USDC)'}
      </button>
      {message && <p className="text-sm mt-2 text-center font-medium">{message}</p>}
    </div>
  );
}
