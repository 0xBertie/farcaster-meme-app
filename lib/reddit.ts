// Парсинг Reddit БЕЗ API ключей через публичные JSON endpoints

export interface RedditPost {
  title: string;
  url: string;
  thumbnail: string;
  author: string;
  subreddit: string;
  score: number;
  permalink: string;
  created: number;
  isImage: boolean;
}

const USER_AGENT = 'FarcasterMemeApp/2.1';

async function fetchRedditJSON(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
    },
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    throw new Error(`Reddit fetch failed: ${response.status}`);
  }

  return response.json();
}

function isImagePost(post: any): boolean {
  const url = post.data.url?.toLowerCase() || '';
  const domain = post.data.domain?.toLowerCase() || '';

  return (
    url.includes('.jpg') || 
    url.includes('.jpeg') || 
    url.includes('.png') || 
    url.includes('.gif') ||
    url.includes('i.redd.it') ||
    domain.includes('imgur.com') ||
    domain.includes('i.imgur.com')
  );
}

function parsePost(post: any): RedditPost {
  return {
    title: post.data.title,
    url: post.data.url,
    thumbnail: post.data.thumbnail !== 'default' && post.data.thumbnail !== 'self' 
      ? post.data.thumbnail 
      : post.data.url,
    author: post.data.author,
    subreddit: post.data.subreddit,
    score: post.data.score,
    permalink: `https://reddit.com${post.data.permalink}`,
    created: post.data.created_utc,
    isImage: isImagePost(post)
  };
}

export async function fetchCryptoMemes(limit = 20): Promise<RedditPost[]> {
  try {
    const subreddits = [
      { name: 'cryptocurrency', sort: 'hot' },
      { name: 'Bitcoin', sort: 'hot' },
      { name: 'CryptoMemes', sort: 'hot' },
      { name: 'dogecoin', sort: 'hot' },
    ];

    const allMemes: RedditPost[] = [];

    for (const sub of subreddits) {
      try {
        const url = `https://www.reddit.com/r/${sub.name}/${sub.sort}.json?limit=25`;
        const data = await fetchRedditJSON(url);

        if (!data?.data?.children) continue;

        const posts = data.data.children
          .map(parsePost)
          .filter((post: RedditPost) => post.isImage && post.score > 50);

        allMemes.push(...posts);
      } catch (error) {
        console.error(`Failed to fetch r/${sub.name}:`, error);
        continue;
      }
    }

    const uniqueMemes = Array.from(
      new Map(allMemes.map(m => [m.url, m])).values()
    );

    return uniqueMemes
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

  } catch (error) {
    console.error('Reddit fetch error:', error);
    return [];
  }
}

export async function fetchTrendingCryptoTopics(): Promise<string[]> {
  try {
    const url = 'https://www.reddit.com/r/cryptocurrency/hot.json?limit=50';
    const data = await fetchRedditJSON(url);

    if (!data?.data?.children) return [];

    const titles = data.data.children.map((p: any) => p.data.title.toLowerCase());

    const mentions: { [key: string]: number } = {};
    const cryptoTerms = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'doge', 'dogecoin',
      'shib', 'shiba', 'pepe', 'solana', 'sol', 'ada', 'cardano',
      'xrp', 'ripple', 'bnb', 'binance', 'usdt', 'usdc'
    ];

    titles.forEach((title: string) => {
      cryptoTerms.forEach(term => {
        if (title.includes(term)) {
          mentions[term] = (mentions[term] || 0) + 1;
        }
      });
    });

    return Object.entries(mentions)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([term]) => term);

  } catch (error) {
    console.error('Trending topics fetch error:', error);
    return [];
  }
}
