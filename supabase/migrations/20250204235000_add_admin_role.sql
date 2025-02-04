-- dealer_users tablosunda role alanını güncelleyelim (eğer yoksa)
ALTER TABLE dealer_users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- user_id için unique constraint ekleyelim
ALTER TABLE dealer_users
ADD CONSTRAINT unique_user_id UNIQUE (user_id);

-- Seçtiğiniz kullanıcıyı admin yapalım
INSERT INTO dealer_users (user_id, role, dealer_id)
VALUES (
  '7e35f612-3ec9-4d32-a310-3e0db341a496',  -- umutcanbostanci@gmail.com kullanıcısının ID'si
  'admin',
  (SELECT id FROM dealers LIMIT 1)  -- İlk dealer'ı alıyoruz
)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin'; 