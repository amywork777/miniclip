-- Create enum type for game status
CREATE TYPE game_status AS ENUM ('pending', 'approved', 'rejected');

-- Create games table
CREATE TABLE games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    screenshot TEXT,
    status game_status DEFAULT 'pending',
    submitted_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_created_at ON games(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved games
CREATE POLICY "Allow public read access to approved games"
    ON games FOR SELECT
    USING (status = 'approved');

-- Allow anyone to insert new games
CREATE POLICY "Allow public insert access"
    ON games FOR INSERT
    WITH CHECK (true);

-- Only allow service role to update game status
CREATE POLICY "Allow service role to update game status"
    ON games FOR UPDATE
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role'); 