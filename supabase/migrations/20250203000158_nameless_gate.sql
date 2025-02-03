/*
  # Update motorcycle table schema and add data
  
  1. Schema Changes
    - Add color_options column for storing available colors
    - Add engine_type column for engine specifications
    
  2. Data Changes
    - Insert motorcycle data with complete specifications
    - Add color options and engine types
*/

-- Add new columns
ALTER TABLE motorcycles 
ADD COLUMN IF NOT EXISTS color_options jsonb,
ADD COLUMN IF NOT EXISTS engine_type text;

-- Insert motorcycle data by category
INSERT INTO motorcycles (brand, model, year, engine_cc, engine_power, category, base_price, engine_type) VALUES
-- ADVENTURE Category
('Honda', 'CRF250L', 2024, 250, 24, 'ADVENTURE', 241000, 'Liquid-cooled, Single-cylinder'),
('Honda', 'CRF250 Rally', 2024, 250, 25, 'ADVENTURE', 267000, 'Liquid-cooled, Single-cylinder'),
('Honda', 'NC750X', 2024, 750, 58, 'ADVENTURE', 516500, 'Liquid-cooled, Parallel-twin'),
('Honda', 'NC750X - DCT', 2024, 750, 58, 'ADVENTURE', 556750, 'Liquid-cooled, Parallel-twin'),
('Honda', 'Transalp', 2024, 755, 67, 'ADVENTURE', 620500, 'Liquid-cooled, Parallel-twin'),
('Honda', 'X-ADV', 2024, 745, 58, 'ADVENTURE', 745500, 'Liquid-cooled, Parallel-twin'),
('Honda', 'Africa Twin', 2024, 1084, 102, 'ADVENTURE', 773000, 'Liquid-cooled, Parallel-twin'),
('Honda', 'Africa Twin (ES) - DCT', 2024, 1084, 102, 'ADVENTURE', 924500, 'Liquid-cooled, Parallel-twin'),

-- DUCATI Categories
('Ducati', 'DesertX (White Livery)', 2024, 937, 110, 'Desert X', 821400, 'L-Twin, Desmodromic'),
('Ducati', 'DesertX (Black Livery)', 2024, 937, 110, 'Desert X', 855070, 'L-Twin, Desmodromic'),
('Ducati', 'DesertX Rally (White Livery)', 2024, 937, 110, 'Desert X', 1064860, 'L-Twin, Desmodromic'),
('Ducati', 'DIAVEL V4 (RED)', 2024, 1103, 168, 'Diavel V4', 1333480, 'V4 Granturismo'),
('Ducati', 'DIAVEL V4 (BLACK)', 2024, 1103, 168, 'Diavel V4', 1350130, 'V4 Granturismo'),

-- YAMAHA Categories
('Yamaha', 'MT-125', 2024, 125, 15, 'Hyper Naked', 230000, 'Liquid-cooled, Single-cylinder'),
('Yamaha', 'MT-07', 2024, 689, 73, 'Hyper Naked', 423500, 'CP2 Parallel-twin'),
('Yamaha', 'MT-09', 2024, 890, 119, 'Hyper Naked', 510000, 'CP3 3-cylinder'),
('Yamaha', 'MT-10', 2024, 998, 165, 'Hyper Naked', 855000, 'CP4 4-cylinder'),
('Yamaha', 'R125', 2024, 125, 15, 'Super Sport', 241500, 'Liquid-cooled, Single-cylinder'),
('Yamaha', 'R1', 2024, 998, 200, 'Super Sport', 1104000, 'Crossplane 4-cylinder'),
('Yamaha', 'Ténéré 700', 2024, 689, 73, 'Adventure', 576000, 'CP2 Parallel-twin'),

-- KTM Categories
('KTM', 'RC 125', 2024, 125, 15, 'Cadde', 298900, 'Liquid-cooled, Single-cylinder'),
('KTM', 'RC 390', 2024, 373, 44, 'Cadde', 406900, 'Liquid-cooled, Single-cylinder'),
('KTM', '125 DUKE', 2024, 125, 15, 'Cadde', 270900, 'Liquid-cooled, Single-cylinder'),
('KTM', '390 DUKE', 2024, 373, 44, 'Cadde', 370500, 'Liquid-cooled, Single-cylinder'),
('KTM', '1390 SUPERDUKE R', 2024, 1350, 190, 'Cadde', 1116500, 'V-Twin'),

-- SUZUKI Categories
('Suzuki', 'GSX 1300R Hayabusa', 2024, 1340, 190, 'Sport', 1149000, 'Liquid-cooled, 4-cylinder'),
('Suzuki', 'GSX-S1000', 2024, 999, 152, 'Naked', 694000, 'Liquid-cooled, 4-cylinder'),
('Suzuki', 'V-Strom 1050 DE', 2024, 1037, 107, 'Adventure', 766000, 'V-Twin'),
('Suzuki', 'Burgman 400', 2024, 400, 31, 'Scooter', 439000, 'Liquid-cooled, Single-cylinder');

-- Update color options
UPDATE motorcycles 
SET color_options = '["White", "Black"]'::jsonb
WHERE model LIKE '%DesertX%';

UPDATE motorcycles 
SET color_options = '["Red", "Black"]'::jsonb
WHERE model LIKE '%DIAVEL%';

UPDATE motorcycles 
SET color_options = '["Blue", "Black", "Red"]'::jsonb
WHERE brand = 'Yamaha' AND model LIKE 'MT-%';

UPDATE motorcycles 
SET color_options = '["Red", "Blue/Silver", "Black"]'::jsonb
WHERE brand = 'Yamaha' AND model LIKE 'R%';