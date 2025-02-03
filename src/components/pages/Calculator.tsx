import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  base_price: number;
  engine_cc: number | null;
  engine_power: number;
  category: string;
  engine_type: string;
  color_options: string[];
}

export function Calculator() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  const fetchMotorcycles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('motorcycles')
        .select('*')
        .order('brand', { ascending: true });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      setMotorcycles(data);
      const uniqueBrands = Array.from(new Set(data.map(m => m.brand))).sort();
      setBrands(uniqueBrands);

    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Veri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    
    const brandModels = motorcycles
      .filter(m => m.brand === brand)
      .map(m => m.model);
    setModels(Array.from(new Set(brandModels)).sort());
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CalcIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Motosiklet Değer Hesaplama
          </h2>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p>
            Motosikletinizin güncel piyasa değerini hesaplamak için lütfen marka ve modelini seçin.
            Sistemimiz, seçtiğiniz motosikletin özelliklerini ve piyasa verilerini analiz ederek
            size en doğru değerlemeyi sunacaktır.
          </p>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Veriler yükleniyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
            <button 
              onClick={fetchMotorcycles}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {!loading && !error && motorcycles.length > 0 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marka
              </label>
              <select
                id="brand"
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="">Marka Seçin</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {selectedBrand && (
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                >
                  <option value="">Model Seçin</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedBrand && selectedModel && (
              <div className="mt-8">
                <button
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Değer Hesapla
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}