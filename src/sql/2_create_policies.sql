-- 2. Add RLS policies and triggers

-- Enable RLS
ALTER TABLE price_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own calculations" ON price_calculations;
DROP POLICY IF EXISTS "Users can create calculations" ON price_calculations;

-- Create policies
CREATE POLICY "Users can view their own calculations"
    ON price_calculations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create calculations"
    ON price_calculations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_price_calculations_updated_at ON price_calculations;

-- Create trigger
CREATE TRIGGER update_price_calculations_updated_at
    BEFORE UPDATE
    ON price_calculations
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 