-- Mevcut unique constraint'leri kaldır
ALTER TABLE motorcycles DROP CONSTRAINT IF EXISTS motorcycles_brand_model_year_key;
ALTER TABLE motorcycles DROP CONSTRAINT IF EXISTS unique_brand_model;

-- Yeni unique constraint ekle
-- Brand ve model kombinasyonu benzersiz olmalı, yıl önemli değil
ALTER TABLE motorcycles ADD CONSTRAINT unique_brand_model_combination UNIQUE (brand, model); 