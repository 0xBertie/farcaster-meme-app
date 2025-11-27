import Link from 'next/link';
import MemeEditor from '@/components/MemeEditor';

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900">Create Meme</h1>
          <Link href="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
            ← Back
          </Link>
        </div>

        <MemeEditor />
      </div>
    </main>
  );
}
