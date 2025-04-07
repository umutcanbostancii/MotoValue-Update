import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// ES modüllerinde __dirname kullanmak için
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// .env dosyasını yükle
dotenv.config({ path: resolve(rootDir, '.env') });

// Supabase bağlantısı
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Public key kullanıyoruz

if (!supabaseUrl || !supabaseKey) {
  console.error('VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY tanımlanmamış!');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key mevcut mu:', supabaseKey ? 'Evet' : 'Hayır');

// Supabase client oluştur
const supabase = createClient(supabaseUrl, supabaseKey);

async function importPrices() {
  try {
    console.log('JSON dosyası okunuyor...');
    const jsonPath = resolve(rootDir, './src/data/all-brands-categories.json');
    console.log('JSON dosya yolu:', jsonPath);
    
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Veri oluşturma
    console.log('Veriler hazırlanıyor...');
    const pricesToInsert = [];
    
    for (const category of data) {
      const categoryName = category.category;
      
      // Her kategorideki ürünleri işle
      for (const product of category.products) {
        // Fiyatı ayıkla (TL işareti ve noktaları kaldır)
        let priceStr = product.price;
        priceStr = priceStr.replace('₺', '').replace(/\./g, '').replace(/\s/g, '');
        const price = parseInt(priceStr, 10);
        
        if (isNaN(price)) {
          console.warn(`Geçersiz fiyat: ${product.price} - ürün atlanıyor:`, product);
          continue;
        }
        
        // Marka bilgisini ayıkla
        let brand = '';
        
        // Kategori isminden marka çıkar
        if (categoryName.includes('-')) {
          brand = categoryName.split('-')[0].trim();
        } else if (categoryName.includes('DUCATI')) {
          brand = 'DUCATI';
        } else if (categoryName.includes('HONDA')) {
          brand = 'HONDA';
        } else if (categoryName.includes('YAMAHA')) {
          brand = 'YAMAHA';
        } else if (categoryName.includes('KTM')) {
          brand = 'KTM';
        } else if (categoryName.includes('SUZUKI')) {
          brand = 'SUZUKI';
        } else if (categoryName.includes('TRIUMPH')) {
          brand = 'TRIUMPH';
        } else if (categoryName.includes('ITALJET')) {
          brand = 'ITALJET';
        } else if (categoryName.includes('KAMAX')) {
          brand = 'KAMAX';
        } else if (categoryName.includes('FANTIC')) {
          brand = 'FANTIC';
        } else if (categoryName.includes('ELECTRIC MOTION')) {
          brand = 'ELECTRIC MOTION';
        } else if (categoryName.includes('ROYAL ALLOY')) {
          brand = 'ROYAL ALLOY';
        } else if (categoryName.includes('MOTO MORINI')) {
          brand = 'MOTO MORINI';
        } else if (categoryName.includes('ADVENTURE')) {
          brand = 'HONDA';
        } else if (categoryName.includes('NAKED')) {
          brand = 'HONDA';
        } else if (categoryName.includes('SCOOTER')) {
          brand = 'HONDA';
        } else if (categoryName.includes('SUPERSPORT')) {
          brand = 'HONDA';
        } else if (categoryName.includes('TOURING')) {
          brand = 'HONDA';
        } else {
          // Kategori adından marka bulunamadıysa
          brand = categoryName;
        }
        
        pricesToInsert.push({
          brand,
          model: product.name,
          year: product.year || null,
          category: categoryName,
          price
        });
      }
    }
    
    // Toplu veri ekle
    console.log(`${pricesToInsert.length} adet kayıt ekleniyor...`);
    
    // Büyük veri setlerini gruplar halinde ekle
    const BATCH_SIZE = 50;
    for (let i = 0; i < pricesToInsert.length; i += BATCH_SIZE) {
      const batch = pricesToInsert.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabase
        .from('motorcycle_prices')
        .insert(batch);
      
      if (insertError) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} ekleme hatası:`, insertError);
        console.error('Hata detayı:', insertError);
      } else {
        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} başarıyla eklendi (${batch.length} kayıt)`);
      }
    }
    
    console.log('Veri aktarımı tamamlandı! Toplam kayıt:', pricesToInsert.length);
  } catch (error) {
    console.error('Script hatası:', error);
  }
}

// Scripti çalıştır
importPrices(); 