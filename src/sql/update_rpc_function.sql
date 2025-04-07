-- Önce mevcut fonksiyonu sil
DROP FUNCTION IF EXISTS calculate_motorcycle_price(uuid, integer, text, jsonb);

-- Sonra yeni fonksiyonu oluştur
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
  damage_details JSONB := '[]'::JSONB;
  total_damage_impact NUMERIC := 0;
  part_key TEXT;
  part_value JSONB;
  part_name TEXT;
  part_status TEXT;
  part_weight NUMERIC;
  part_impact NUMERIC;
  total_weighted_impact NUMERIC := 0;
  total_weight NUMERIC := 0;
BEGIN
  -- Motosiklet bilgilerini al
  SELECT * INTO motorcycle_record FROM motorcycles WHERE id = input_motorcycle_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Motosiklet bulunamadı';
  END IF;
  
  -- Yaş hesapla
  age := current_year - motorcycle_record.year;
  
  -- Baz fiyat
  base_price := motorcycle_record.price;
  
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
  
  -- Kilometre faktörü - ikinci el motosikletlerin değerini daha fazla düşürelim
  IF input_mileage < 1000 THEN
    mileage_factor := 1.02; -- %2 artış (neredeyse sıfır)
  ELSIF input_mileage < 5000 THEN
    mileage_factor := 1.0; -- Değişiklik yok (standart)
  ELSIF input_mileage < 10000 THEN
    mileage_factor := 0.97; -- %3 düşüş
  ELSIF input_mileage < 20000 THEN
    mileage_factor := 0.94; -- %6 düşüş
  ELSIF input_mileage < 30000 THEN
    mileage_factor := 0.90; -- %10 düşüş
  ELSIF input_mileage < 50000 THEN
    mileage_factor := 0.85; -- %15 düşüş
  ELSIF input_mileage < 70000 THEN
    mileage_factor := 0.80; -- %20 düşüş
  ELSIF input_mileage < 100000 THEN
    mileage_factor := 0.75; -- %25 düşüş
  ELSE
    mileage_factor := 0.70; -- %30 düşüş
  END IF;
  
  -- Durum faktörü
  CASE input_condition
    WHEN 'new' THEN condition_factor := 1.0; -- Sıfır
    WHEN 'excellent' THEN condition_factor := 0.95; -- %5 düşüş
    WHEN 'good' THEN condition_factor := 0.90; -- %10 düşüş
    WHEN 'fair' THEN condition_factor := 0.85; -- %15 düşüş
    WHEN 'poor' THEN condition_factor := 0.75; -- %25 düşüş
    ELSE condition_factor := 0.80;
  END CASE;
  
  -- Gelişmiş Hasar faktörü hesaplama
  -- Her parçanın ağırlık faktörü tanımlaması
  FOR part_key, part_value IN SELECT * FROM jsonb_each(input_damage_status)
  LOOP
    part_name := part_key;
    part_status := part_value->>'status';
    
    -- Parça ağırlıkları (önem derecesine göre)
    CASE part_name
      WHEN 'chassis' THEN part_weight := 0.25; -- Şasi çok önemli
      WHEN 'engine' THEN part_weight := 0.20; -- Motor çok önemli
      WHEN 'transmission' THEN part_weight := 0.15; -- Şanzıman önemli
      WHEN 'frontFork' THEN part_weight := 0.10; -- Ön amortisör önemli
      WHEN 'fuelTank' THEN part_weight := 0.05; -- Yakıt deposu daha az önemli
      WHEN 'electrical' THEN part_weight := 0.10; -- Elektrik sistemi önemli
      WHEN 'frontPanel' THEN part_weight := 0.05; -- Ön panel daha az önemli
      WHEN 'rearPanel' THEN part_weight := 0.05; -- Arka panel daha az önemli
      WHEN 'exhaust' THEN part_weight := 0.05; -- Egzoz daha az önemli
      ELSE part_weight := 0.05; -- Diğer parçalar
    END CASE;
    
    -- Parça durumuna göre etki faktörü
    CASE part_status
      WHEN 'Orijinal' THEN part_impact := 0.0; -- Orijinal parça etkisi yok
      WHEN 'Boyalı' THEN part_impact := 0.05; -- Boyalı parça %5 değer kaybı
      WHEN 'Değişen' THEN part_impact := 0.15; -- Değişen parça %15 değer kaybı
      WHEN 'Hasarlı' THEN part_impact := 0.25; -- Hasarlı parça %25 değer kaybı
      ELSE part_impact := 0.0; -- Varsayılan
    END CASE;
    
    -- Ağırlıklı etki hesabı
    total_weighted_impact := total_weighted_impact + (part_weight * part_impact);
    total_weight := total_weight + part_weight;
    
    -- Hasar detaylarını JSON'a ekle
    damage_details := damage_details || jsonb_build_object(
      'part', part_name,
      'status', part_status,
      'weight', part_weight,
      'impact', part_impact,
      'weighted_impact', ROUND(part_weight * part_impact * 100) || '%'
    );
  END LOOP;
  
  -- Toplam hasar faktörünü hesapla (ağırlıklı ortalama)
  IF total_weight > 0 THEN
    damage_factor := 1.0 - total_weighted_impact;
  ELSE
    damage_factor := 1.0; -- Hasar bilgisi yoksa varsayılan
  END IF;
  
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
        'description', 'Hasarlı ve değişen parçalara göre',
        'factor', damage_factor,
        'effect', CASE WHEN damage_factor < 1.0 THEN '-' || ROUND((1.0 - damage_factor) * 100) || '%' ELSE ROUND((damage_factor - 1.0) * 100) || '%' END,
        'amount', ROUND((damage_factor - 1.0) * base_price)
      )
    ),
    'damage_details', damage_details,
    'calculated_price', ROUND(base_price * category_factor * cc_factor * age_factor * mileage_factor * condition_factor * damage_factor)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 