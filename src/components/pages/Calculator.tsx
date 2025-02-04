import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  condition: string;
  mileage: number;
  engine_power: string;
  engine_cc: string;
  timing_type: string;
  cylinder_count: string;
  transmission: string;
  cooling: string;
  color: string;
  origin: string;
  tradeable: boolean;
}

interface TechnicalFeatures {
  abs: boolean;
  airbag: boolean;
  alarm: boolean;
  immobilizer: boolean;
  traction_control: boolean;
  cbs: boolean;
  quick_shifter: boolean;
  side_protection: boolean;
  front_protection: boolean;
}

interface Accessories {
  heated_grips: boolean;
  rear_carrier: boolean;
  luggage_system: boolean;
  carbon: boolean;
  nos: boolean;
  led_stop: boolean;
  xenon: boolean;
  gps: boolean;
  led_signals: boolean;
  sound_system: boolean;
  front_camera: boolean;
  double_stand: boolean;
}

interface DamageStatus {
  chassis: { condition: string; repair: string };
  engine: { condition: string; repair: string };
  transmission: { condition: string; repair: string };
  front_fork: { condition: string; repair: string };
  fuel_tank: { condition: string; repair: string };
  electrical: { condition: string; repair: string };
  front_panel: { condition: string; repair: string };
  rear_panel: { condition: string; repair: string };
  exhaust: { condition: string; repair: string };
}

export function Calculator() {
  // Temel bilgiler state'leri
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');

  // Teknik özellikler state'leri
  const [enginePower, setEnginePower] = useState('');
  const [engineCC, setEngineCC] = useState('');
  const [timingType, setTimingType] = useState('');
  const [cylinderCount, setCylinderCount] = useState('');
  const [transmission, setTransmission] = useState('');
  const [cooling, setCooling] = useState('');
  const [color, setColor] = useState('');
  const [origin, setOrigin] = useState('');
  const [tradeable, setTradeable] = useState(false);

  // Güvenlik özellikleri state'i
  const [technicalFeatures, setTechnicalFeatures] = useState<TechnicalFeatures>({
    abs: false,
    airbag: false,
    alarm: false,
    immobilizer: false,
    traction_control: false,
    cbs: false,
    quick_shifter: false,
    side_protection: false,
    front_protection: false,
  });

  // Aksesuar state'i
  const [accessories, setAccessories] = useState<Accessories>({
    heated_grips: false,
    rear_carrier: false,
    luggage_system: false,
    carbon: false,
    nos: false,
    led_stop: false,
    xenon: false,
    gps: false,
    led_signals: false,
    sound_system: false,
    front_camera: false,
    double_stand: false,
  });

  // Hasar/Tramer durumu state'i
  const [damageStatus, setDamageStatus] = useState<DamageStatus>({
    chassis: { condition: 'Orijinal', repair: '' },
    engine: { condition: 'Orijinal', repair: '' },
    transmission: { condition: 'Orijinal', repair: '' },
    front_fork: { condition: 'Orijinal', repair: '' },
    fuel_tank: { condition: 'Orijinal', repair: '' },
    electrical: { condition: 'Orijinal', repair: '' },
    front_panel: { condition: 'Orijinal', repair: '' },
    rear_panel: { condition: 'Orijinal', repair: '' },
    exhaust: { condition: 'Orijinal', repair: '' },
  });

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

      const uniqueBrands = Array.from(new Set(data.map(m => m.brand))).sort();
      setBrands(uniqueBrands);

    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'Veri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = async (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    
    const { data } = await supabase
      .from('motorcycles')
      .select('model')
      .eq('brand', brand)
      .order('model', { ascending: true });

    if (data) {
      const uniqueModels = Array.from(new Set(data.map((m: { model: string }) => m.model))).sort();
      setModels(uniqueModels);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Burada fiyat hesaplama mantığı gelecek
  };

  const handleDamageStatusChange = (
    key: keyof DamageStatus,
    field: 'condition' | 'repair',
    value: string
  ) => {
    setDamageStatus(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CalcIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Fiyat Hesapla
          </h2>
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

        {!loading && !error && (
          <form className="space-y-8">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Marka
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!selectedBrand}
                >
                  <option value="">Seçiniz</option>
                  {models.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="sport">Sport</option>
                  <option value="naked">Naked</option>
                  <option value="touring">Touring</option>
                  <option value="cruiser">Cruiser</option>
                  <option value="enduro">Enduro</option>
                  <option value="scooter">Scooter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yıl
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kilometre
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Kilometre giriniz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Durum
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="new">Sıfır</option>
                  <option value="used">İkinci El</option>
                </select>
              </div>
            </div>

            {/* Teknik Özellikler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Teknik Özellikler
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Araç Durumu
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sıfır</option>
                    <option value="used">İkinci El</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motor Gücü
                  </label>
                  <select
                    value={enginePower}
                    onChange={(e) => setEnginePower(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">101 - 125 hp</option>
                    <option value="126-150">126 - 150 hp</option>
                    <option value="151-175">151 - 175 hp</option>
                    <option value="176-200">176 - 200 hp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Motor Hacmi
                  </label>
                  <select
                    value={engineCC}
                    onChange={(e) => setEngineCC(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">251 - 350 cm³</option>
                    <option value="351-500">351 - 500 cm³</option>
                    <option value="501-750">501 - 750 cm³</option>
                    <option value="751-1000">751 - 1000 cm³</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zamanlama Tipi
                  </label>
                  <select
                    value={timingType}
                    onChange={(e) => setTimingType(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="4-stroke">4 Zamanlı</option>
                    <option value="2-stroke">2 Zamanlı</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Silindir Sayısı
                  </label>
                  <select
                    value={cylinderCount}
                    onChange={(e) => setCylinderCount(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="single">Tek Silindir</option>
                    <option value="twin">Çift Silindir</option>
                    <option value="triple">Üç Silindir</option>
                    <option value="four">Dört Silindir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vites
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="manual">Manuel</option>
                    <option value="automatic">Otomatik</option>
                    <option value="semi">Yarı Otomatik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Soğutma
                  </label>
                  <select
                    value={cooling}
                    onChange={(e) => setCooling(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="air">Hava</option>
                    <option value="liquid">Sıvı</option>
                    <option value="oil">Yağ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Renk
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="black">Siyah</option>
                    <option value="white">Beyaz</option>
                    <option value="red">Kırmızı</option>
                    <option value="blue">Mavi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Menşei
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="japan">Japonya</option>
                    <option value="germany">Almanya</option>
                    <option value="italy">İtalya</option>
                    <option value="usa">ABD</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={tradeable}
                    onChange={(e) => setTradeable(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Takasa Açık</span>
                </label>
              </div>
            </div>

            {/* Özellikler */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Özellikler
              </h3>
              
              {/* Güvenlik */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Güvenlik
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(technicalFeatures).map(([key, value]) => (
                    <label key={key} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setTechnicalFeatures(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Aksesuar */}
              <div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Aksesuar
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(accessories).map(([key, value]) => (
                    <label key={key} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setAccessories(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Hasar/Tramer Durumu */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Hasar/Tramer Durumu
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(damageStatus).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    <select
                      value={value.condition}
                      onChange={(e) => handleDamageStatusChange(key as keyof DamageStatus, 'condition', e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="original">Orijinal</option>
                      <option value="painted">Boyalı</option>
                      <option value="changed">Değişen</option>
                      <option value="none">Yok</option>
                    </select>
                    <select
                      value={value.repair}
                      onChange={(e) => handleDamageStatusChange(key as keyof DamageStatus, 'repair', e.target.value)}
                      className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Onarım Durumu</option>
                      <option value="repaired">Onarıldı</option>
                      <option value="not_repaired">Onarılmadı</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Hesapla Butonu */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Değer Hesapla
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}