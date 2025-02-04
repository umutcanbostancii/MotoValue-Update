import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import 'colors';
import * as dotenv from 'dotenv';
import fetch from 'cross-fetch';

// Load environment variables
dotenv.config();

// Constants
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables'.red);
  process.exit(1);
}

// Initialize Supabase client with service role key and fetch
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: fetch
  }
});

interface Product {
  name: string;
  year: number | null;
  price: string;
  color_options?: string;
  kampanya_price?: string;
}

interface CategoryData {
  category: string;
  products: Product[];
}

async function importMotorcycles() {
  try {
    // Read JSON file
    const jsonPath = join(cwd(), 'src/data/all-brands-categories.json');
    const jsonData = readFileSync(jsonPath, 'utf-8');
    const motorcycleData: CategoryData[] = JSON.parse(jsonData);

    console.log('JSON data loaded successfully'.green);

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('motorcycles')
      .delete()
      .not('id', 'is', null);

    if (deleteError) {
      throw new Error(`Error clearing existing data: ${deleteError.message}`);
    }

    console.log('Existing data cleared'.yellow);

    // Process and insert data
    const processedModels = new Map<string, {
      brand: string;
      model: string;
      category: string;
      price: string;
      year: number;
      color_options: string[];
    }>();

    for (const categoryData of motorcycleData) {
      // Kategori adını parçalayalım (örn: "DUCATI - Monster" -> ["DUCATI", "Monster"])
      const categoryParts = categoryData.category.split(' - ');
      const brand = categoryParts[0].trim();
      const category = categoryParts.length > 1 ? categoryParts[1].trim() : categoryParts[0].trim();

      for (const product of categoryData.products) {
        try {
          // Fiyat kontrolü ekleyelim
          if (!product.price) {
            console.error(`Missing price for ${brand} ${product.name}`.red);
            continue;
          }

          // Fiyatı temizleyelim (örn: "123.000 ₺" -> "123000")
          const cleanPrice = product.price.replace(/[^0-9]/g, '');
          
          // Renk seçeneklerini dizi olarak ayarlayalım
          const colorOptions = product.color_options ? 
            product.color_options.split(',').map(color => color.trim()) : 
            [];

          const modelKey = `${brand}-${product.name}`;
          const existingModel = processedModels.get(modelKey);

          // Eğer model daha önce işlendiyse ve yeni fiyat daha yüksekse güncelle
          if (existingModel && parseInt(cleanPrice) > parseInt(existingModel.price)) {
            processedModels.set(modelKey, {
              brand,
              model: product.name,
              category,
              price: cleanPrice,
              year: product.year || new Date().getFullYear(),
              color_options: colorOptions
            });
          } else if (!existingModel) {
            // Model daha önce işlenmediyse ekle
            processedModels.set(modelKey, {
              brand,
              model: product.name,
              category,
              price: cleanPrice,
              year: product.year || new Date().getFullYear(),
              color_options: colorOptions
            });
          }
        } catch (error) {
          console.error(`Error processing ${brand} ${product.name}: ${error}`.red);
          continue;
        }
      }
    }

    // Insert processed models
    for (const modelData of processedModels.values()) {
      const { error: insertError } = await supabase
        .from('motorcycles')
        .insert({
          brand: modelData.brand,
          model: modelData.model,
          category: modelData.category,
          price: modelData.price,
          year: modelData.year,
          color_options: modelData.color_options,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error(`Error inserting ${modelData.brand} ${modelData.model}: ${insertError.message}`.red);
        continue;
      }

      console.log(`Imported: ${modelData.brand} ${modelData.model}`.green);
    }

    console.log('\nImport completed successfully!'.green);
  } catch (error) {
    console.error('Import failed:'.red, error);
    process.exit(1);
  }
}

// Run the import
importMotorcycles(); 