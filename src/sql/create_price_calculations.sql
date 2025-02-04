-- Create price_calculations table
CREATE TABLE IF NOT EXISTS price_calculations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    
    -- Basic Information
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    condition TEXT NOT NULL,
    category TEXT,
    
    -- Technical Specifications
    engine_power TEXT,
    engine_cc TEXT,
    timing_type TEXT,
    cylinder_count TEXT,
    transmission TEXT,
    cooling TEXT,
    color TEXT,
    origin TEXT,
    
    -- Features and Status
    technical_features JSONB DEFAULT '{}'::jsonb,
    accessories JSONB DEFAULT '{}'::jsonb,
    damage_status JSONB DEFAULT '{}'::jsonb,
    tradeable BOOLEAN DEFAULT false,
    
    -- Calculation Result
    calculated_price NUMERIC(12,2),
    
    -- Metadata
    calculation_version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending'
);

-- Add RLS policies
ALTER TABLE price_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own calculations" ON price_calculations;
DROP POLICY IF EXISTS "Users can create calculations" ON price_calculations;

-- Allow users to view their own calculations
CREATE POLICY "Users can view their own calculations"
    ON price_calculations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to create calculations
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_calculations_user_id ON price_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_price_calculations_brand_model ON price_calculations(brand, model);
CREATE INDEX IF NOT EXISTS idx_price_calculations_created_at ON price_calculations(created_at); 