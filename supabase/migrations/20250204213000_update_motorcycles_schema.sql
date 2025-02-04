-- Önce mevcut tabloyu temizleyelim (migration sırasında veri kaybı olabilir)
TRUNCATE TABLE motorcycles;

-- Tabloyu güncelleyelim
ALTER TABLE motorcycles
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS price TEXT,
ADD COLUMN IF NOT EXISTS color_options TEXT[],
ADD COLUMN IF NOT EXISTS engine_power TEXT,
ADD COLUMN IF NOT EXISTS engine_cc TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- Unique constraint ekleyelim
ALTER TABLE motorcycles
ADD CONSTRAINT unique_brand_model UNIQUE (brand, model);

-- Updated at trigger ekleyelim
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_motorcycles_updated_at ON motorcycles;

CREATE TRIGGER update_motorcycles_updated_at
    BEFORE UPDATE ON motorcycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS politikalarını güncelleyelim
ALTER TABLE motorcycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Motorcycles are viewable by everyone"
ON motorcycles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Motorcycles are insertable by admin"
ON motorcycles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dealer_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Motorcycles are updatable by admin"
ON motorcycles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM dealer_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dealer_users
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
); 