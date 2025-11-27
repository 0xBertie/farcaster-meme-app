import { Meme } from '@/lib/db';
import VotingButton from './VotingButton';

export default function MemeCard({ meme }: { meme: Meme }) {
  const sourceIcon = {
    user: '👤',
    reddit: '🔴',
    twitter: '🐦'
  }[meme.source] || '📷';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative aspect-square">
        <img src={meme.image_url} alt={meme.prompt || 'Meme'} 
          className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {sourceIcon} {meme.source}
        </div>
      </div>

      <div className="p-4">
        {meme.prompt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meme.prompt}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold">👍 {meme.vote_count}</span>
            <span className="text-sm font-semibold text-green-600">
              💰 ${meme.total_earned.toFixed(2)}
            </span>
          </div>
        </div>

        <VotingButton memeId={meme.id} />

        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-500">Creator FID: {meme.creator_fid}</p>
          <p className="text-xs text-gray-400">{new Date(meme.created_at).toLocaleDateString()}</p>
          {meme.source_url && (
            <a href={meme.source_url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline">
              View Source →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
