/*
  # MotoValue veritabanı şeması

  1. Yeni Tablolar
    - `motorcycles`: Motosiklet marka ve model bilgileri
    - `dealers`: Bayi bilgileri
    - `dealer_users`: Bayi kullanıcıları
    - `price_algorithms`: Fiyat hesaplama parametreleri
    - `price_calculations`: Hesaplama geçmişi

  2. Güvenlik
    - Tüm tablolar için RLS politikaları
    - Bayi kullanıcıları için rol bazlı erişim
*/

-- Motosiklet tablosu
CREATE TABLE motorcycles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand text NOT NULL,
    model text NOT NULL,
    year int NOT NULL,
    engine_cc int NOT NULL,
    engine_power int NOT NULL,
    category text NOT NULL,
    base_price int NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(brand, model, year)
);

-- Bayi tablosu
CREATE TABLE dealers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive'))
);

-- Bayi kullanıcıları tablosu
CREATE TABLE dealer_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id uuid REFERENCES dealers(id) ON DELETE CASCADE,
    firebase_uid text NOT NULL UNIQUE,
    role text NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_role CHECK (role IN ('owner', 'employee'))
);

-- Fiyat algoritması tablosu
CREATE TABLE price_algorithms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dealer_id uuid REFERENCES dealers(id) ON DELETE CASCADE,
    age_factor float NOT NULL DEFAULT 0.95,
    mileage_factor float NOT NULL DEFAULT 0.90,
    condition_factor float NOT NULL DEFAULT 0.85,
    market_trend_factor float NOT NULL DEFAULT 1.0,
    created_at timestamptz DEFAULT now()
);

-- Fiyat hesaplama geçmişi tablosu
CREATE TABLE price_calculations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    motorcycle_id uuid REFERENCES motorcycles(id) ON DELETE CASCADE,
    dealer_id uuid REFERENCES dealers(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    mileage int NOT NULL,
    condition text NOT NULL,
    calculated_price int NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_condition CHECK (condition IN ('new', 'excellent', 'good', 'fair', 'poor'))
);

-- RLS Politikaları
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_algorithms ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_calculations ENABLE ROW LEVEL SECURITY;

-- Motorcycles tablosu için politikalar
CREATE POLICY "motorcycles_select_policy"
    ON motorcycles FOR SELECT
    TO authenticated
    USING (true);

-- Dealers tablosu için politikalar
CREATE POLICY "dealers_select_policy"
    ON dealers FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "dealers_all_policy"
    ON dealers FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM dealer_users 
            WHERE dealer_users.firebase_uid = auth.uid()::text 
            AND dealer_users.role = 'owner'
        )
    );

-- Dealer Users tablosu için politikalar
CREATE POLICY "dealer_users_select_policy"
    ON dealer_users FOR SELECT
    TO authenticated
    USING (firebase_uid = auth.uid()::text);

-- Price Algorithms tablosu için politikalar
CREATE POLICY "price_algorithms_select_policy"
    ON price_algorithms FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM dealer_users 
            WHERE dealer_users.dealer_id = price_algorithms.dealer_id 
            AND dealer_users.firebase_uid = auth.uid()::text
        )
    );

CREATE POLICY "price_algorithms_all_policy"
    ON price_algorithms FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM dealer_users 
            WHERE dealer_users.dealer_id = price_algorithms.dealer_id 
            AND dealer_users.firebase_uid = auth.uid()::text
            AND dealer_users.role = 'owner'
        )
    );

-- Price Calculations tablosu için politikalar
CREATE POLICY "price_calculations_select_policy"
    ON price_calculations FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()::text OR
        EXISTS (
            SELECT 1 
            FROM dealer_users 
            WHERE dealer_users.dealer_id = price_calculations.dealer_id 
            AND dealer_users.firebase_uid = auth.uid()::text
        )
    );

-- Örnek motosiklet verileri
INSERT INTO motorcycles (brand, model, year, engine_cc, engine_power, category, base_price) VALUES
    ('Honda', 'CBR 650R', 2023, 649, 95, 'Sport', 285000),
    ('Yamaha', 'MT-07', 2023, 689, 73, 'Naked', 225000),
    ('Ducati', 'Monster', 2023, 937, 111, 'Naked', 420000);