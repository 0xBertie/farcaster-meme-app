import Link from 'next/link';
import TrendingMemes from '@/components/TrendingMemes';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 py-6">
          <h1 className="text-5xl font-bold text-purple-900 mb-2">
            🎨 Meme Voting App
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Create memes • Vote with USDC • Discover trending crypto memes
          </p>
          <Link href="/create"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors">
            ✨ Create Meme
          </Link>
        </header>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🏆 Trending Memes</h2>
          <TrendingMemes />
        </section>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>Vote with USDC on BASE • Powered by Farcaster • Reddit memes via public JSON</p>
        </footer>
      </div>
    </main>
  );
}
