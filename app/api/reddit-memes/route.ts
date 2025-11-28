import { NextResponse } from 'next/server';
import { fetchCryptoMemes } from '@/lib/reddit';
import { createMeme, supabase } from '@/lib/db';

// УЖЕ БЫЛО, но добавляем runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 1800;

export async function GET() {
  try {
    console.log('Fetching crypto memes from Reddit...');

    const redditMemes = await fetchCryptoMemes(15);

    if (redditMemes.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No memes fetched from Reddit' 
      }, { status: 500 });
    }

    let savedCount = 0;

    for (const rm of redditMemes) {
      try {
        const { data: existing } = await supabase
          .from('memes')
          .select('id')
          .eq('image_url', rm.url)
          .single();

        if (existing) continue;

        await createMeme({
          creator_fid: 0,
          image_url: rm.url,
          thumbnail_url: rm.thumbnail,
          prompt: rm.title,
          source: 'reddit',
          source_url: rm.permalink,
          vote_count: 0,
          total_earned: 0
        });

        savedCount++;
      } catch (err) {
        console.error('Failed to save meme:', err);
        continue;
      }
    }

    return NextResponse.json({ 
      success: true, 
      fetched: redditMemes.length,
      saved: savedCount,
      message: `Fetched ${redditMemes.length} memes, saved ${savedCount} new ones`
    });

  } catch (error: any) {
    console.error('Reddit fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch from Reddit',
        details: 'Check if Reddit JSON endpoints are accessible'
      },
      { status: 500 }
    );
  }
}
