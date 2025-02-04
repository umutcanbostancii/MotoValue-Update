-- 1. Create price_calculations table
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