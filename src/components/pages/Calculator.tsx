import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

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
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

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
    
    if (loading) return; // Prevent double submission
    
    try {
      setLoading(true);
      await handleCalculate();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
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

  const handleCalculate = async () => {
    try {
      // Gerekli alanların kontrolü
      if (!selectedBrand || !selectedModel || !selectedYear || !mileage || !condition) {
        toast.error('Lütfen gerekli alanları doldurunuz');
        return;
      }

      // Mevcut kullanıcıyı al
      const userResponse = await Promise.race([
        supabase.auth.getUser(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
      ]) as Awaited<ReturnType<typeof supabase.auth.getUser>>;

      if (userResponse.error) {
        toast.error('Kullanıcı bilgisi alınamadı');
        return;
      }

      const user = userResponse.data.user;
      if (!user) {
        toast.error('Lütfen giriş yapınız');
        return;
      }

      // Veriyi hazırla
      const calculationData = {
        user_id: user.id,
        brand: selectedBrand,
        model: selectedModel,
        year: parseInt(selectedYear),
        mileage: parseInt(mileage),
        condition,
        category: selectedCategory || null,
        engine_power: enginePower || null,
        engine_cc: engineCC || null,
        timing_type: timingType || null,
        cylinder_count: cylinderCount || null,
        transmission: transmission || null,
        cooling: cooling || null,
        color: color || null,
        origin: origin || null,
        technical_features: technicalFeatures,
        accessories: accessories,
        damage_status: damageStatus,
        tradeable,
        status: 'pending'
      };

      interface PriceCalculation {
        calculated_price: number;
        [key: string]: any;
      }
      
      // Fiyat hesaplama isteği
      const result = await Promise.race([
        supabase
          .from('price_calculations')
          .insert(calculationData)
          .select()
          .single(),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
      ]) as { data: PriceCalculation | null; error: any };

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Başarılı hesaplama
      if (result.data) {
        setCalculatedPrice(result.data.calculated_price);
        
        if (result.data.calculated_price) {
          toast.success(`Hesaplanan Fiyat: ${new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY'
          }).format(result.data.calculated_price)}`);
        }
      }

    } catch (error: any) {
      if (error.message === 'Timeout') {
        toast.error('İşlem zaman aşımına uğradı, lütfen tekrar deneyiniz');
      } else {
        console.error('Hesaplama hatası:', error);
        toast.error(error.message || 'Fiyat hesaplanırken bir hata oluştu');
      }
      throw error;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">
          <CalcIcon className="h-6 w-6 inline-block mr-2" />
          Fiyat Hesapla
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Temel Bilgiler */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Marka</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {brands.map((b) => (
                    <option key={b} value={b} className="text-white bg-gray-700">{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {models.map((m) => (
                    <option key={m} value={m} className="text-white bg-gray-700">{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Yıl</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year} className="text-white bg-gray-700">{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kilometre</label>
                <input
                  type="number"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Kilometre giriniz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option value="new">Sıfır</option>
                  <option value="used">İkinci El</option>
                </select>
              </div>
            </div>
          </div>

          {/* Teknik Özellikler */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Teknik Özellikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Motor Gücü</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={enginePower}
                  onChange={(e) => setEnginePower(e.target.value)}
                >
                  <option value="">101 - 125 hp</option>
                  <option value="126-150">126 - 150 hp</option>
                  <option value="151-175">151 - 175 hp</option>
                  <option value="176-200">176 - 200 hp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Motor Hacmi</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={engineCC}
                  onChange={(e) => setEngineCC(e.target.value)}
                >
                  <option value="">251 - 350 cm³</option>
                  <option value="351-500">351 - 500 cm³</option>
                  <option value="501-750">501 - 750 cm³</option>
                  <option value="751-1000">751 - 1000 cm³</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Zamanlama Tipi</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={timingType}
                  onChange={(e) => setTimingType(e.target.value)}
                >
                  <option value="4-stroke">4 Zamanlı</option>
                  <option value="2-stroke">2 Zamanlı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Silindir Sayısı</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cylinderCount}
                  onChange={(e) => setCylinderCount(e.target.value)}
                >
                  <option value="single">Tek Silindir</option>
                  <option value="twin">Çift Silindir</option>
                  <option value="triple">Üç Silindir</option>
                  <option value="four">Dört Silindir</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Vites</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                >
                  <option value="manual">Manuel</option>
                  <option value="automatic">Otomatik</option>
                  <option value="semi">Yarı Otomatik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Soğutma</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cooling}
                  onChange={(e) => setCooling(e.target.value)}
                >
                  <option value="air">Hava</option>
                  <option value="liquid">Sıvı</option>
                  <option value="oil">Yağ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Renk</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value="black">Siyah</option>
                  <option value="white">Beyaz</option>
                  <option value="red">Kırmızı</option>
                  <option value="blue">Mavi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Menşei</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
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
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Özellikler</h2>
            
            {/* Güvenlik */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-300 mb-3">Güvenlik</h3>
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
              <h3 className="text-md font-medium text-gray-300 mb-3">Aksesuar</h3>
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
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Hasar/Tramer Durumu</h2>
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(damageStatus).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 items-center">
                  <span className="text-sm font-medium text-gray-300">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                  <select
                    className="rounded-md border border-gray-600 text-white bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value.condition}
                    onChange={(e) => handleDamageStatusChange(key as keyof DamageStatus, 'condition', e.target.value)}
                  >
                    <option value="original">Orijinal</option>
                    <option value="painted">Boyalı</option>
                    <option value="changed">Değişen</option>
                    <option value="none">Yok</option>
                  </select>
                  <select
                    className="rounded-md border border-gray-600 text-white bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={value.repair}
                    onChange={(e) => handleDamageStatusChange(key as keyof DamageStatus, 'repair', e.target.value)}
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
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Hesaplanıyor...</span>
                </>
              ) : (
                <>
                  <CalcIcon className="h-5 w-5" />
                  <span>Fiyat Hesapla</span>
                </>
              )}
            </button>
          </div>

          {/* Hesaplama Sonucu */}
          {calculatedPrice !== null && (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center">
              <h2 className="text-lg font-semibold text-white mb-4">Hesaplama Sonucu</h2>
              <div className="text-3xl font-bold text-green-500">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(calculatedPrice)}
              </div>
              <p className="text-gray-400 mt-2">
                {selectedYear} {selectedBrand} {selectedModel}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}