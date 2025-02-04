-- price_calculations tablosunu güncelleyelim
ALTER TABLE price_calculations DROP CONSTRAINT IF EXISTS price_calculations_motorcycle_id_fkey;
ALTER TABLE price_calculations ALTER COLUMN motorcycle_id DROP NOT NULL;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS technical_features jsonb;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS accessories jsonb;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS damage_status jsonb;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS engine_power text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS engine_cc text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS timing_type text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS cylinder_count text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS transmission text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS cooling text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS origin text;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS tradeable boolean;
ALTER TABLE price_calculations ADD COLUMN IF NOT EXISTS status text;

-- RLS politikasını ekleyelim
DROP POLICY IF EXISTS "price_calculations_insert_policy" ON price_calculations;
CREATE POLICY "price_calculations_insert_policy"
    ON price_calculations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = user_id);

-- Fiyat hesaplama trigger'ını ekleyelim
CREATE OR REPLACE FUNCTION calculate_price()
RETURNS TRIGGER AS $$
DECLARE
    base_price numeric;
    year_factor numeric;
    mileage_factor numeric;
    condition_factor numeric;
    features_factor numeric;
    damage_factor numeric;
BEGIN
    -- Temel fiyat (marka ve modele göre)
    SELECT price INTO base_price
    FROM motorcycles
    WHERE brand = NEW.brand AND model = NEW.model
    LIMIT 1;

    IF base_price IS NULL THEN
        base_price := 100000; -- Varsayılan fiyat
    END IF;

    -- Yıl faktörü (her yıl için %5 değer kaybı)
    year_factor := 1 - ((EXTRACT(YEAR FROM CURRENT_DATE) - NEW.year::integer) * 0.05);
    
    -- Kilometre faktörü (her 10000 km için %3 değer kaybı)
    mileage_factor := 1 - ((NEW.mileage::numeric / 10000) * 0.03);
    
    -- Durum faktörü
    condition_factor := CASE 
        WHEN NEW.condition = 'new' THEN 1.0
        WHEN NEW.condition = 'used' THEN 0.8
        ELSE 0.7
    END;

    -- Özellikler faktörü
    features_factor := 1 + (
        (jsonb_array_length(NEW.technical_features) + 
         jsonb_array_length(NEW.accessories)) * 0.02
    );

    -- Hasar faktörü
    damage_factor := 1 - (
        (SELECT count(*)
         FROM jsonb_each(NEW.damage_status) 
         WHERE value->>'condition' != 'original'
        ) * 0.05
    );

    -- Final fiyat hesaplama
    NEW.calculated_price := ROUND(
        base_price * 
        GREATEST(year_factor, 0.3) * 
        GREATEST(mileage_factor, 0.3) * 
        condition_factor * 
        features_factor * 
        GREATEST(damage_factor, 0.5)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı ekleyelim
DROP TRIGGER IF EXISTS before_price_calculation_insert ON price_calculations;
CREATE TRIGGER before_price_calculation_insert
    BEFORE INSERT ON price_calculations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_price(); 