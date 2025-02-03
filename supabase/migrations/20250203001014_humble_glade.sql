/*
  # Update Motorcycle Schema and Data

  1. Schema Changes
    - Make engine_cc nullable for electric motorcycles
    - Add color_options and engine_type columns
    - Clear and reload motorcycle data with complete information
  
  2. Data Changes
    - Add comprehensive motorcycle catalog with detailed specifications
    - Include color options and engine types
    - Organize by categories (Adventure, Sport, Naked, etc.)
*/

-- First, modify the schema to allow NULL engine_cc for electric motorcycles
ALTER TABLE motorcycles 
ALTER COLUMN engine_cc DROP NOT NULL;

-- Add new columns if they don't exist
ALTER TABLE motorcycles 
ADD COLUMN IF NOT EXISTS color_options jsonb,
ADD COLUMN IF NOT EXISTS engine_type text;

-- Clear existing data safely
TRUNCATE TABLE motorcycles, price_calculations CASCADE;

-- Insert motorcycle data by category
INSERT INTO motorcycles (brand, model, year, engine_cc, engine_power, category, base_price, engine_type, color_options) VALUES
-- HONDA ADVENTURE
('Honda', 'CRF250L', 2024, 250, 24, 'ADVENTURE', 241000, 'Liquid-cooled Single', '["Red", "Black"]'::jsonb),
('Honda', 'CRF250 Rally', 2024, 250, 25, 'ADVENTURE', 267000, 'Liquid-cooled Single', '["Red", "Black"]'::jsonb),
('Honda', 'NC750X', 2024, 750, 58, 'ADVENTURE', 516500, 'Parallel Twin', '["Grand Prix Red", "Mat Ballistic Black"]'::jsonb),
('Honda', 'NC750X DCT', 2024, 750, 58, 'ADVENTURE', 556750, 'Parallel Twin', '["Grand Prix Red", "Mat Ballistic Black"]'::jsonb),
('Honda', 'Transalp', 2024, 755, 67, 'ADVENTURE', 620500, 'Parallel Twin', '["Ross White", "Mat Ballistic Black"]'::jsonb),
('Honda', 'X-ADV', 2024, 745, 58, 'ADVENTURE', 745500, 'Parallel Twin', '["Mat Ballistic Black", "Pearl Deep Mud Gray"]'::jsonb),
('Honda', 'Africa Twin', 2024, 1084, 102, 'ADVENTURE', 773000, 'Parallel Twin', '["Grand Prix Red", "Mat Ballistic Black"]'::jsonb),
('Honda', 'Africa Twin ES DCT', 2024, 1084, 102, 'ADVENTURE', 924500, 'Parallel Twin', '["Grand Prix Red", "Mat Ballistic Black"]'::jsonb),
('Honda', 'Africa Twin Adventure Sports DCT', 2024, 1084, 102, 'ADVENTURE', 952250, 'Parallel Twin', '["Pearl Glare White", "Mat Ballistic Black"]'::jsonb),
('Honda', 'Africa Twin Adventure Sports DCT Premium', 2024, 1084, 102, 'ADVENTURE', 1022000, 'Parallel Twin', '["Pearl Glare White", "Mat Ballistic Black"]'::jsonb),

-- DUCATI DESERT X
('Ducati', 'DesertX White', 2024, 937, 110, 'Desert X', 821400, 'L-Twin Testastretta', '["Star White Silk"]'::jsonb),
('Ducati', 'DesertX Black', 2024, 937, 110, 'Desert X', 855070, 'L-Twin Testastretta', '["Thrilling Black"]'::jsonb),
('Ducati', 'DesertX Rally', 2024, 937, 110, 'Desert X', 1064860, 'L-Twin Testastretta', '["Rally White"]'::jsonb),

-- DUCATI DIAVEL
('Ducati', 'Diavel V4 Red', 2024, 1103, 168, 'Diavel V4', 1333480, 'V4 Granturismo', '["Ducati Red"]'::jsonb),
('Ducati', 'Diavel V4 Black', 2024, 1103, 168, 'Diavel V4', 1350130, 'V4 Granturismo', '["Thrilling Black"]'::jsonb),

-- DUCATI MONSTER
('Ducati', 'Monster Red', 2024, 937, 111, 'Monster', 565730, 'L-Twin Testastretta', '["Ducati Red"]'::jsonb),
('Ducati', 'Monster White', 2024, 937, 111, 'Monster', 577200, 'L-Twin Testastretta', '["Iceberg White"]'::jsonb),
('Ducati', 'Monster Plus', 2024, 937, 111, 'Monster', 605520, 'L-Twin Testastretta', '["Ducati Red", "Aviator Grey"]'::jsonb),
('Ducati', 'Monster SP', 2024, 937, 111, 'Monster', 709660, 'L-Twin Testastretta', '["Ducati Red"]'::jsonb),
('Ducati', 'Monster 30° Anniversario', 2024, 937, 111, 'Monster', 846190, 'L-Twin Testastretta', '["Special Livery"]'::jsonb),

-- ELECTRIC MOTION
('Electric Motion', 'Escape XR', 2024, 0, 11, 'Electric', 536900, 'Electric Motor', '["Blue/Grey"]'::jsonb),
('Electric Motion', 'E-Pure Race', 2023, 0, 11, 'Electric', 414900, 'Electric Motor', '["Blue/Grey"]'::jsonb),

-- YAMAHA HYPER NAKED
('Yamaha', 'MT-125', 2024, 125, 15, 'Hyper Naked', 230000, 'Liquid-cooled Single', '["Icon Blue", "Tech Black"]'::jsonb),
('Yamaha', 'MT-07', 2024, 689, 73, 'Hyper Naked', 423500, 'CP2 Twin', '["Icon Blue", "Tech Black", "Cyan Storm"]'::jsonb),
('Yamaha', 'MT-09', 2024, 890, 119, 'Hyper Naked', 510000, 'CP3 Triple', '["Icon Blue", "Tech Black", "Cyan Storm"]'::jsonb),
('Yamaha', 'MT-10', 2024, 998, 165, 'Hyper Naked', 855000, 'CP4 Crossplane', '["Icon Blue", "Tech Black", "Cyan Storm"]'::jsonb),

-- YAMAHA SUPER SPORT
('Yamaha', 'R125', 2024, 125, 15, 'Super Sport', 241500, 'Liquid-cooled Single', '["Icon Blue", "Tech Black"]'::jsonb),
('Yamaha', 'R1', 2024, 998, 200, 'Super Sport', 1104000, 'Crossplane 4-cylinder', '["Icon Blue", "Tech Black"]'::jsonb),

-- KTM STREET
('KTM', 'RC 125', 2024, 125, 15, 'Street', 298900, 'Single Cylinder', '["Orange", "Black"]'::jsonb),
('KTM', 'RC 390', 2024, 373, 44, 'Street', 406900, 'Single Cylinder', '["Orange", "Black"]'::jsonb),
('KTM', '125 DUKE', 2024, 125, 15, 'Street', 270900, 'Single Cylinder', '["Orange", "Black"]'::jsonb),
('KTM', '390 DUKE', 2024, 373, 44, 'Street', 370500, 'Single Cylinder', '["Orange", "Black"]'::jsonb),
('KTM', '1390 SUPERDUKE R', 2024, 1350, 190, 'Street', 1116500, 'V-Twin', '["Orange", "Black"]'::jsonb),

-- SUZUKI
('Suzuki', 'GSX 1300R Hayabusa', 2024, 1340, 190, 'Sport', 1149000, 'Inline-4', '["Glass Sparkle Black", "Pearl Brilliant White"]'::jsonb),
('Suzuki', 'GSX-S1000', 2024, 999, 152, 'Naked', 694000, 'Inline-4', '["Metallic Mat Black", "Metallic Triton Blue"]'::jsonb),
('Suzuki', 'V-Strom 1050 DE', 2024, 1037, 107, 'Adventure', 766000, 'V-Twin', '["Champion Yellow", "Glass Sparkle Black"]'::jsonb),
('Suzuki', 'Burgman 400', 2024, 400, 31, 'Scooter', 439000, 'Single Cylinder', '["Metallic Mat Black", "Pearl Brilliant White"]'::jsonb);

-- Add RLS policies if not already present
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'motorcycles' AND policyname = 'motorcycles_select_policy'
    ) THEN
        CREATE POLICY "motorcycles_select_policy"
            ON motorcycles FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;