import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export interface Meme {
  id: string;
  creator_fid: number;
  image_url: string;
  thumbnail_url?: string;
  prompt?: string;
  source: 'user' | 'reddit' | 'twitter';
  source_url?: string;
  created_at: string;
  vote_count: number;
  total_earned: number;
  is_featured: boolean;
}

export interface MemeTemplate {
  id: string;
  name: string;
  image_url: string;
  thumbnail_url?: string;
  top_text_default?: string;
  bottom_text_default?: string;
  usage_count: number;
}

export async function createMeme(data: Partial<Meme>) {
  const { data: meme, error } = await supabase.from('memes').insert(data).select().single();
  return { meme, error };
}

export async function getTopMemes(limit = 20) {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  return { memes: data, error };
}

export async function getTrendingMemes(days = 7, limit = 20) {
  const { data, error } = await supabase.rpc('get_trending_memes', {
    days: days,
    limit_count: limit
  });
  return { memes: data, error };
}

export async function getMemesBySource(source: string, limit = 20) {
  const { data, error } = await supabase
    .from('memes')
    .select('*')
    .eq('source', source)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { memes: data, error };
}

export async function getMemeTemplates() {
  const { data, error } = await supabase
    .from('meme_templates')
    .select('*')
    .eq('is_active', true)
    .order('usage_count', { ascending: false });
  return { templates: data, error };
}

export async function incrementVote(memeId: string, amount: number, voterFid: number, txHash: string) {
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('transaction_hash', txHash)
    .single();

  if (existingVote) {
    return { meme: null, error: { message: 'Vote already recorded' } };
  }

  const { error: voteError } = await supabase.from('votes').insert({
    meme_id: memeId,
    voter_fid: voterFid,
    transaction_hash: txHash,
    amount: amount
  });

  if (voteError) return { meme: null, error: voteError };

  const { data, error } = await supabase.rpc('increment_vote', {
    meme_id: memeId,
    vote_amount: amount
  });

  return { meme: data, error };
}

export async function uploadImage(file: File, userId: number): Promise<{ url: string | null, error: any }> {
  const fileName = `${userId}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('memes')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) return { url: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('memes')
    .getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}

export { supabase };
