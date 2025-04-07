-- Motosiklet fiyat hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_motorcycle_price(
  input_motorcycle_id UUID,
  input_mileage INTEGER DEFAULT NULL,
  input_condition TEXT DEFAULT 'iyi',
  input_damage_status JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  motorcycle_record RECORD;
  base_price NUMERIC;
  final_price NUMERIC;
  age_factor NUMERIC;
  mileage_factor NUMERIC := 1.0;
  condition_factor NUMERIC := 1.0;
  damage_factor NUMERIC := 1.0;
  current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
  result JSONB;
  damage_details JSONB;
BEGIN
  -- Motosiklet bilgilerini al
  SELECT 
    m.*,
    mp.price AS base_market_price
  INTO motorcycle_record
  FROM 
    motorcycles m
  LEFT JOIN
    motorcycle_prices mp ON 
      LOWER(mp.brand) = LOWER(m.brand) AND 
      (mp.model ILIKE '%' || m.model || '%' OR m.model ILIKE '%' || mp.model || '%')
  WHERE 
    m.id = input_motorcycle_id;
  
  IF motorcycle_record IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'Motosiklet bulunamadı',
      'motorcycle_id', input_motorcycle_id
    );
  END IF;
  
  -- Temel fiyatı belirle (katalogdan)
  IF motorcycle_record.base_market_price IS NOT NULL AND motorcycle_record.base_market_price > 0 THEN
    base_price := motorcycle_record.base_market_price;
  ELSE
    -- Fiyat bulunamadıysa yaklaşık bir değer hesapla
    -- Burada markalara göre base price belirleyebiliriz
    CASE 
      WHEN LOWER(motorcycle_record.brand) = 'honda' THEN base_price := 400000;
      WHEN LOWER(motorcycle_record.brand) = 'yamaha' THEN base_price := 450000;
      WHEN LOWER(motorcycle_record.brand) = 'suzuki' THEN base_price := 430000;
      WHEN LOWER(motorcycle_record.brand) = 'kawasaki' THEN base_price := 480000;
      WHEN LOWER(motorcycle_record.brand) = 'bmw' THEN base_price := 800000;
      WHEN LOWER(motorcycle_record.brand) = 'ducati' THEN base_price := 900000;
      WHEN LOWER(motorcycle_record.brand) = 'harley-davidson' THEN base_price := 750000;
      WHEN LOWER(motorcycle_record.brand) = 'triumph' THEN base_price := 550000;
      WHEN LOWER(motorcycle_record.brand) = 'ktm' THEN base_price := 500000;
      WHEN LOWER(motorcycle_record.brand) = 'vespa' THEN base_price := 120000;
      ELSE base_price := 300000; -- Default değer
    END CASE;
    
    -- Motor hacmine göre ayarla
    IF motorcycle_record.engine_cc > 1000 THEN
      base_price := base_price * 1.4;
    ELSIF motorcycle_record.engine_cc > 750 THEN
      base_price := base_price * 1.2;
    ELSIF motorcycle_record.engine_cc > 500 THEN
      base_price := base_price * 1.0;
    ELSIF motorcycle_record.engine_cc > 250 THEN
      base_price := base_price * 0.8;
    ELSE
      base_price := base_price * 0.6;
    END IF;
  END IF;

  -- Yaş faktörü hesapla
  IF motorcycle_record.year IS NOT NULL THEN
    age_factor := GREATEST(0.5, 1.0 - (0.05 * (current_year - motorcycle_record.year)));
  ELSE
    age_factor := 0.8; -- Yıl bilgisi yoksa varsayılan değer
  END IF;

  -- Kilometre faktörü hesapla (kullanıcı girişi varsa)
  IF input_mileage IS NOT NULL AND input_mileage > 0 THEN
    CASE
      WHEN input_mileage < 5000 THEN mileage_factor := 1.0;
      WHEN input_mileage < 10000 THEN mileage_factor := 0.95;
      WHEN input_mileage < 20000 THEN mileage_factor := 0.9;
      WHEN input_mileage < 30000 THEN mileage_factor := 0.85;
      WHEN input_mileage < 50000 THEN mileage_factor := 0.8;
      WHEN input_mileage < 70000 THEN mileage_factor := 0.7;
      WHEN input_mileage < 100000 THEN mileage_factor := 0.6;
      ELSE mileage_factor := 0.5;
    END CASE;
  END IF;

  -- Durum faktörü hesapla
  IF input_condition IS NOT NULL THEN
    CASE LOWER(input_condition)
      WHEN 'çok iyi' THEN condition_factor := 1.1;
      WHEN 'iyi' THEN condition_factor := 1.0;
      WHEN 'orta' THEN condition_factor := 0.9;
      WHEN 'kötü' THEN condition_factor := 0.8;
      ELSE condition_factor := 1.0; -- Default durum
    END CASE;
  END IF;

  -- Hasar durumu faktörü hesapla
  IF input_damage_status IS NOT NULL AND jsonb_typeof(input_damage_status) = 'object' THEN
    -- Parça hasarlarına göre faktörleri hesapla
    damage_factor := 1.0;
    damage_details := '[]'::jsonb;

    -- Hasar detaylarını hesapla
    FOR i IN 0..jsonb_object_length(input_damage_status)-1 LOOP
      DECLARE
        part_key TEXT;
        part_status JSONB;
        part_name TEXT;
        status_value TEXT;
        weight NUMERIC;
        impact NUMERIC;
      BEGIN
        part_key := (jsonb_object_keys(input_damage_status))[i+1];
        part_status := input_damage_status->part_key;
        
        -- Parça adını belirle
        CASE part_key
          WHEN 'frontPanel' THEN part_name := 'Ön Panel';
          WHEN 'tank' THEN part_name := 'Yakıt Deposu';
          WHEN 'seat' THEN part_name := 'Sele';
          WHEN 'frontFender' THEN part_name := 'Ön Çamurluk';
          WHEN 'rearFender' THEN part_name := 'Arka Çamurluk';
          WHEN 'exhaust' THEN part_name := 'Egzoz';
          WHEN 'engine' THEN part_name := 'Motor';
          WHEN 'frontWheel' THEN part_name := 'Ön Tekerlek';
          WHEN 'rearWheel' THEN part_name := 'Arka Tekerlek';
          WHEN 'electricalSystem' THEN part_name := 'Elektrik Sistemi';
          WHEN 'chassis' THEN part_name := 'Şasi';
          WHEN 'frontSuspension' THEN part_name := 'Ön Süspansiyon';
          WHEN 'rearSuspension' THEN part_name := 'Arka Süspansiyon';
          ELSE part_name := part_key;
        END CASE;
        
        -- Durum değerini ve ağırlığını belirle
        IF jsonb_typeof(part_status) = 'object' AND part_status ? 'status' THEN
          status_value := part_status->>'status';
          
          -- Parçanın önem ağırlığını belirle
          CASE part_key
            WHEN 'engine' THEN weight := 0.25;
            WHEN 'electricalSystem' THEN weight := 0.15;
            WHEN 'chassis' THEN weight := 0.15;
            WHEN 'frontSuspension' THEN weight := 0.1;
            WHEN 'rearSuspension' THEN weight := 0.1;
            WHEN 'frontWheel' THEN weight := 0.08;
            WHEN 'rearWheel' THEN weight := 0.08;
            WHEN 'tank' THEN weight := 0.06;
            WHEN 'frontPanel' THEN weight := 0.04;
            WHEN 'seat' THEN weight := 0.03;
            WHEN 'exhaust' THEN weight := 0.05;
            WHEN 'frontFender' THEN weight := 0.02;
            WHEN 'rearFender' THEN weight := 0.02;
            ELSE weight := 0.03;
          END CASE;
          
          -- Duruma göre fiyat etkisini belirle
          CASE LOWER(status_value)
            WHEN 'orijinal' THEN impact := 0.0;
            WHEN 'boyalı' THEN impact := -0.2;
            WHEN 'değişen' THEN impact := -0.5;
            WHEN 'hasarlı' THEN impact := -0.8;
            ELSE impact := 0.0;
          END CASE;
          
          -- Fiyat faktörüne etkisini hesapla
          damage_factor := damage_factor + (impact * weight);
          
          -- Hasar detayları listesine ekle
          damage_details := damage_details || jsonb_build_object(
            'part', part_name,
            'status', status_value,
            'weight', weight,
            'impact', impact * weight * 100
          );
        END IF;
      END;
    END LOOP;
    
    -- Damage faktörünü sınırla
    damage_factor := GREATEST(0.5, damage_factor);
  END IF;

  -- Son fiyatı hesapla
  final_price := base_price * age_factor * mileage_factor * condition_factor * damage_factor;
  final_price := ROUND(final_price / 1000) * 1000; -- 1000'lik yuvarla
  
  -- Sonuç nesnesini oluştur
  result := jsonb_build_object(
    'base_price', base_price,
    'calculated_price', final_price,
    'age_factor', age_factor,
    'mileage_factor', mileage_factor,
    'condition_factor', condition_factor,
    'damage_factor', damage_factor,
    'motorcycle_id', motorcycle_record.id,
    'brand', motorcycle_record.brand,
    'model', motorcycle_record.model,
    'year', motorcycle_record.year,
    'damage_details', damage_details
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 