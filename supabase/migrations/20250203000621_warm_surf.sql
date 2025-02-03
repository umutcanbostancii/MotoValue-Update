/*
  # Update motorcycles table schema
  
  1. Schema Changes
    - Allow NULL values for engine_cc column for electric motorcycles
  
  2. Data Changes
    - No data changes in this migration
*/

-- Modify engine_cc column to allow NULL values
ALTER TABLE motorcycles 
ALTER COLUMN engine_cc DROP NOT NULL;