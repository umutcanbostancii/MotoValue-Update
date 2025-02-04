/*
  # Rename base_price column to price
  
  1. Schema Changes
    - Rename base_price column to price to match JSON data
  
  2. Data Changes
    - No data changes in this migration
*/

-- Rename base_price column to price
ALTER TABLE motorcycles 
RENAME COLUMN base_price TO price; 