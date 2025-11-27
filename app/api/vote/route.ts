import { NextRequest, NextResponse } from 'next/server';
import { incrementVote } from '@/lib/db';

const VOTE_PRICE = 0.01;

export async function POST(req: NextRequest) {
  try {
    const { memeId, transactionHash, voterFid } = await req.json();

    if (!memeId || !transactionHash || !voterFid) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { meme, error } = await incrementVote(memeId, VOTE_PRICE, voterFid, transactionHash);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, meme });
  } catch (error: any) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Vote failed' },
      { status: 500 }
    );
  }
}
