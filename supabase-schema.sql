-- Таблица мемов
CREATE TABLE memes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_fid INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt TEXT,
  source VARCHAR(50) DEFAULT 'user',
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  vote_count INTEGER DEFAULT 0,
  total_earned DECIMAL(10,2) DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_vote_count ON memes(vote_count DESC);
CREATE INDEX idx_creator_fid ON memes(creator_fid);
CREATE INDEX idx_created_at ON memes(created_at DESC);
CREATE INDEX idx_source ON memes(source);

-- Таблица голосов
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meme_id UUID REFERENCES memes(id) ON DELETE CASCADE,
  voter_fid INTEGER NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_votes_meme ON votes(meme_id);
CREATE INDEX idx_votes_voter ON votes(voter_fid);

-- Таблица шаблонов
CREATE TABLE meme_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  top_text_default VARCHAR(200),
  bottom_text_default VARCHAR(200),
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Популярные шаблоны
INSERT INTO meme_templates (name, image_url, top_text_default, bottom_text_default) VALUES
('Doge', 'https://i.imgflip.com/4t0m5.jpg', 'SUCH WOW', 'MUCH CRYPTO'),
('Drake', 'https://i.imgflip.com/30b1gx.jpg', 'SELLING CRYPTO', 'HODL FOREVER'),
('Distracted Boyfriend', 'https://i.imgflip.com/1ur9b0.jpg', 'FOMO', 'DYOR'),
('Two Buttons', 'https://i.imgflip.com/1g8my4.jpg', 'SELL NOW', 'BUY MORE'),
('Wojak', 'https://i.imgflip.com/2hgfw.jpg', 'BOUGHT THE TOP', 'SOLD THE BOTTOM');

-- Функции
CREATE OR REPLACE FUNCTION increment_vote(meme_id UUID, vote_amount DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE memes SET vote_count = vote_count + 1, total_earned = total_earned + vote_amount WHERE id = meme_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_trending_memes(days INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID, creator_fid INTEGER, image_url TEXT, prompt TEXT, source VARCHAR(50),
  vote_count INTEGER, total_earned DECIMAL, created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.id, m.creator_fid, m.image_url, m.prompt, m.source, m.vote_count, m.total_earned, m.created_at
  FROM memes m
  WHERE m.created_at >= NOW() - (days || ' days')::INTERVAL
  ORDER BY m.vote_count DESC, m.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
