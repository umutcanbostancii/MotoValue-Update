/*
  # Remove engine_power column from motorcycles table
  
  1. Schema Changes
    - Remove engine_power column as it's not currently needed
  
  2. Data Changes
    - No data changes in this migration
*/

-- Remove engine_power column
ALTER TABLE motorcycles 
DROP COLUMN IF EXISTS engine_power; 