CREATE OR REPLACE FUNCTION calculate_motorcycle_price(
  input_motorcycle_id UUID,
  input_mileage INTEGER,
  input_condition TEXT,
  input_damage_status JSONB
)
RETURNS JSONB AS $$
DECLARE
  base_price NUMERIC;
  motorcycle_record RECORD;
  brand_factor NUMERIC := 1.0;
  category_factor NUMERIC := 1.0;
  cc_factor NUMERIC := 1.0;
  age_factor NUMERIC := 1.0;
  mileage_factor NUMERIC := 1.0;
  condition_factor NUMERIC := 1.0;
  damage_factor NUMERIC := 1.0;
  region_factor NUMERIC := 1.0;
  result JSONB;
  current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER;
  age INTEGER;
  price_adjustments JSONB := '[]'::JSONB;
BEGIN
  -- Motosiklet bilgilerini al
  SELECT * INTO motorcycle_record FROM motorcycles WHERE id = input_motorcycle_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Motosiklet bulunamadı';
  END IF;
  
  -- Yaş hesapla
  age := current_year - motorcycle_record.year;
  
  -- Baz fiyat
  base_price := motorcycle_record.base_price;
  
  -- Kategori faktörü
  CASE motorcycle_record.category
    WHEN 'ADVENTURE' THEN category_factor := 1.2;
    WHEN 'Sport' THEN category_factor := 1.3;
    WHEN 'Naked' THEN category_factor := 1.1;
    WHEN 'Desert X' THEN category_factor := 1.25;
    WHEN 'Diavel V4' THEN category_factor := 1.35;
    WHEN 'Monster' THEN category_factor := 1.15;
    WHEN 'Electric' THEN category_factor := 1.4;
    WHEN 'Hyper Naked' THEN category_factor := 1.25;
    WHEN 'Super Sport' THEN category_factor := 1.35;
    WHEN 'Street' THEN category_factor := 1.05;
    WHEN 'Scooter' THEN category_factor := 0.9;
    ELSE category_factor := 1.0;
  END CASE;
  
  -- Motor hacmi faktörü
  IF motorcycle_record.engine_cc = 0 THEN -- Elektrikli
    cc_factor := 1.5;
  ELSIF motorcycle_record.engine_cc > 1000 THEN
    cc_factor := 1.3;
  ELSIF motorcycle_record.engine_cc >= 750 THEN
    cc_factor := 1.2;
  ELSIF motorcycle_record.engine_cc >= 500 THEN
    cc_factor := 1.1;
  ELSIF motorcycle_record.engine_cc >= 250 THEN
    cc_factor := 1.05;
  ELSE
    cc_factor := 1.0;
  END IF;
  
  -- Yaş faktörü (her yıl %5 değer kaybı)
  age_factor := POWER(0.95, age);
  
  -- Kilometre faktörü
  IF input_mileage < 1000 THEN
    mileage_factor := 1.05;
  ELSIF input_mileage < 5000 THEN
    mileage_factor := 1.02;
  ELSIF input_mileage < 10000 THEN
    mileage_factor := 1.0;
  ELSIF input_mileage < 20000 THEN
    mileage_factor := 0.97;
  ELSIF input_mileage < 30000 THEN
    mileage_factor := 0.94;
  ELSIF input_mileage < 50000 THEN
    mileage_factor := 0.90;
  ELSIF input_mileage < 70000 THEN
    mileage_factor := 0.85;
  ELSIF input_mileage < 100000 THEN
    mileage_factor := 0.80;
  ELSE
    mileage_factor := 0.75;
  END IF;
  
  -- Durum faktörü
  CASE input_condition
    WHEN 'new' THEN condition_factor := 1.1;
    WHEN 'excellent' THEN condition_factor := 1.05;
    WHEN 'good' THEN condition_factor := 1.0;
    WHEN 'fair' THEN condition_factor := 0.9;
    WHEN 'poor' THEN condition_factor := 0.8;
    ELSE condition_factor := 0.85;
  END CASE;
  
  -- Hasar faktörü (örneğin değişen parçalar sayısına göre)
  SELECT 1.0 - (0.05 * (
    SELECT COUNT(*) FROM jsonb_each(input_damage_status)
    WHERE value->>'status' != 'Orijinal'
  )) INTO damage_factor;
  
  -- Minimum hasar faktörü
  damage_factor := GREATEST(damage_factor, 0.7);
  
  -- Tüm faktörlerin çarpımı ile son fiyatı hesapla
  result := jsonb_build_object(
    'motorcycle_details', jsonb_build_object(
      'brand', motorcycle_record.brand,
      'model', motorcycle_record.model,
      'year', motorcycle_record.year,
      'category', motorcycle_record.category,
      'engine_cc', motorcycle_record.engine_cc
    ),
    'base_price', base_price,
    'price_adjustments', jsonb_build_array(
      jsonb_build_object(
        'name', 'Kategori Faktörü',
        'description', motorcycle_record.category || ' kategorisi',
        'factor', category_factor,
        'effect', ROUND((category_factor - 1.0) * 100) || '%',
        'amount', ROUND((category_factor - 1.0) * base_price)
      ),
      jsonb_build_object(
        'name', 'Motor Hacmi Faktörü',
        'description', motorcycle_record.engine_cc || ' cc motor',
        'factor', cc_factor,
        'effect', ROUND((cc_factor - 1.0) * 100) || '%',
        'amount', ROUND((cc_factor - 1.0) * base_price)
      ),
      jsonb_build_object(
        'name', 'Yaş Faktörü',
        'description', age || ' yıl',
        'factor', age_factor,
        'effect', CASE WHEN age_factor < 1.0 THEN '-' || ROUND((1.0 - age_factor) * 100) || '%' ELSE ROUND((age_factor - 1.0) * 100) || '%' END,
        'amount', ROUND((age_factor - 1.0) * base_price)
      ),
      jsonb_build_object(
        'name', 'Kilometre Faktörü',
        'description', input_mileage || ' km',
        'factor', mileage_factor,
        'effect', CASE WHEN mileage_factor < 1.0 THEN '-' || ROUND((1.0 - mileage_factor) * 100) || '%' ELSE ROUND((mileage_factor - 1.0) * 100) || '%' END,
        'amount', ROUND((mileage_factor - 1.0) * base_price)
      ),
      jsonb_build_object(
        'name', 'Durum Faktörü',
        'description', input_condition,
        'factor', condition_factor,
        'effect', CASE WHEN condition_factor < 1.0 THEN '-' || ROUND((1.0 - condition_factor) * 100) || '%' ELSE ROUND((condition_factor - 1.0) * 100) || '%' END,
        'amount', ROUND((condition_factor - 1.0) * base_price)
      ),
      jsonb_build_object(
        'name', 'Hasar Faktörü',
        'description', 'Hasarlı parça sayısına göre',
        'factor', damage_factor,
        'effect', CASE WHEN damage_factor < 1.0 THEN '-' || ROUND((1.0 - damage_factor) * 100) || '%' ELSE ROUND((damage_factor - 1.0) * 100) || '%' END,
        'amount', ROUND((damage_factor - 1.0) * base_price)
      )
    ),
    'calculated_price', ROUND(base_price * category_factor * cc_factor * age_factor * mileage_factor * condition_factor * damage_factor)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 