import { NextRequest, NextResponse } from 'next/server';
import { getTopMemes, getMemesBySource } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '20');

    let result;
    if (source) {
      result = await getMemesBySource(source, limit);
    } else {
      result = await getTopMemes(limit);
    }

    const { memes, error } = result;
    if (error) throw error;

    return NextResponse.json({ success: true, memes: memes || [] });
  } catch (error: any) {
    console.error('Get memes error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed' },
      { status: 500 }
    );
  }
}
