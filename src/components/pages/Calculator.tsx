import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Search, ChevronDown, ChevronUp, ExternalLink, MapPin, Calendar, Gauge, Eye, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  price: string;
  color_options?: string[];
}

interface SearchResult {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  location: string;
  date: string;
  image: string;
  title: string;
  link: string;
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
  [key: string]: { status: string };
}

interface PriceResult {
  sahibindenAverage: number;
  algorithmResult: number;
  finalResult: number;
}

export function Calculator() {
  // Seçim state'leri
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [subModels, setSubModels] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSubModel, setSelectedSubModel] = useState('');
  
  // Arama sonuçları
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedCard, setSelectedCard] = useState<SearchResult | null>(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Dropdown state'leri
  const [showTechnical, setShowTechnical] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showDamage, setShowDamage] = useState(false);

  // Form state'leri
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
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

  const [damageStatus, setDamageStatus] = useState<DamageStatus>({
    chassis: { status: 'Orijinal' },
    engine: { status: 'Orijinal' },
    transmission: { status: 'Orijinal' },
    frontFork: { status: 'Orijinal' },
    fuelTank: { status: 'Orijinal' },
    electrical: { status: 'Orijinal' },
    frontPanel: { status: 'Orijinal' },
    rearPanel: { status: 'Orijinal' },
    exhaust: { status: 'Orijinal' },
  });

  // Fiyat hesaplama
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('motorcycles')
        .select('brand')
        .order('brand', { ascending: true });

      if (error) throw error;

      const uniqueBrands = Array.from(new Set(data.map(m => m.brand))).sort();
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Markalar yüklenirken hata:', error);
      toast.error('Markalar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = async (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    setSelectedSubModel('');
    setModels([]);
    setSubModels([]);

    try {
      const { data, error } = await supabase
        .from('motorcycles')
        .select('model')
        .eq('brand', brand)
        .order('model', { ascending: true });

      if (error) throw error;

      const uniqueModels = Array.from(new Set(data.map(m => m.model))).sort();
      setModels(uniqueModels);
    } catch (error) {
      console.error('Modeller yüklenirken hata:', error);
      toast.error('Modeller yüklenirken bir hata oluştu');
    }
  };

  const handleModelSelect = async (model: string) => {
    setSelectedModel(model);
    setSelectedSubModel('');
    setSubModels([]);

    try {
      const { data, error } = await supabase
        .from('motorcycles')
        .select('model')
        .eq('brand', selectedBrand)
        .ilike('model', `%${model}%`)
        .order('model', { ascending: true });

      if (error) throw error;

      const variants = data
        .map(m => m.model)
        .filter(m => m !== model && m.includes(model))
        .slice(0, 5);

      if (variants.length > 0) {
        setSubModels(variants);
      }
    } catch (error) {
      console.error('Alt modeller yüklenirken hata:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedBrand || !selectedModel) {
      toast.error('Lütfen marka ve model seçiniz');
      return;
    }

    setSearching(true);
    try {
      const mockResults: SearchResult[] = [
        {
          id: '1',
          brand: selectedBrand,
          model: selectedModel,
          year: 2023,
          price: '450.000 ₺',
          mileage: 5000,
          location: 'İstanbul, Kadıköy',
          date: '2 gün önce',
          image: '/api/placeholder/300/200',
          title: `${selectedBrand} ${selectedModel} - Temiz Araç`,
          link: 'https://sahibinden.com/ilan/vasita-motosiklet-honda-cbr-650r-1234567'
        },
        {
          id: '2',
          brand: selectedBrand,
          model: selectedModel,
          year: 2022,
          price: '420.000 ₺',
          mileage: 12000,
          location: 'Ankara, Çankaya',
          date: '1 hafta önce',
          image: '/api/placeholder/300/200',
          title: `${selectedBrand} ${selectedModel} - Az Kullanılmış`,
          link: 'https://sahibinden.com/ilan/vasita-motosiklet-honda-cbr-650r-1234568'
        },
        {
          id: '3',
          brand: selectedBrand,
          model: selectedModel,
          year: 2021,
          price: '380.000 ₺',
          mileage: 25000,
          location: 'İzmir, Bornova',
          date: '3 gün önce',
          image: '/api/placeholder/300/200',
          title: `${selectedBrand} ${selectedModel} - Bakımlı`,
          link: 'https://sahibinden.com/ilan/vasita-motosiklet-honda-cbr-650r-1234569'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSearchResults(mockResults);
      toast.success(`${mockResults.length} ilan bulundu`);
    } catch (error) {
      console.error('Arama hatası:', error);
      toast.error('Arama sırasında bir hata oluştu');
    } finally {
      setSearching(false);
    }
  };

  const handleDamageStatusChange = (key: string, value: string) => {
    setDamageStatus(prev => ({
      ...prev,
      [key]: { status: value }
    }));
  };

  const handleCalculatePrice = async () => {
    if (!selectedBrand || !selectedModel || !mileage || !condition) {
      toast.error('Lütfen gerekli alanları doldurunuz');
      return;
    }

    setCalculating(true);
    try {
      // Motosiklet ID'sini bul
      const { data: motorcycleData, error: motorcycleError } = await supabase
        .from('motorcycles')
        .select('id, brand, model, year, price')
        .eq('brand', selectedBrand)
        .eq('model', selectedModel)
        .limit(1)
        .single();

      if (motorcycleError || !motorcycleData) {
        toast.error(`Motosiklet bilgisi bulunamadı: ${selectedBrand} ${selectedModel}`);
        return;
      }

      // RPC fonksiyonunu çağır
      const { data: calculationData, error: calculationError } = await supabase
        .rpc('calculate_motorcycle_price', {
          input_motorcycle_id: motorcycleData.id,
          input_mileage: parseInt(mileage, 10),
          input_condition: condition,
          input_damage_status: damageStatus
        });

      if (calculationError) {
        throw new Error(calculationError.message);
      }

      if (!calculationData) {
        throw new Error('Hesaplama yapılamadı');
      }

      // Sahibinden ortalaması (statik)
      const sahibindenAverage = 425000;
      const algorithmResult = calculationData.calculated_price;
      const finalResult = Math.round((sahibindenAverage + algorithmResult) / 2);

      setPriceResult({
        sahibindenAverage,
        algorithmResult,
        finalResult
      });

      toast.success('Fiyat hesaplama tamamlandı!');
    } catch (error: any) {
      console.error('Hesaplama hatası:', error);
      toast.error(error.message || 'Fiyat hesaplanırken bir hata oluştu');
    } finally {
      setCalculating(false);
    }
  };

  const resetSelection = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedSubModel('');
    setModels([]);
    setSubModels([]);
    setSearchResults([]);
    setPriceResult(null);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          <CalcIcon className="h-6 w-6 inline-block mr-2" />
          Fiyat Hesapla
        </h1>

        {/* Marka/Model/Alt Model Seçimi */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Motosiklet Seçimi</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Markalar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Markalar</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200 dark:border-gray-600">
                {loading ? (
                  <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>
                ) : (
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandSelect(brand)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedBrand === brand
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modeller */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modeller</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200 dark:border-gray-600">
                {!selectedBrand ? (
                  <div className="text-gray-500 dark:text-gray-400">Önce marka seçiniz</div>
                ) : models.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">Model bulunamadı</div>
                ) : (
                  <div className="space-y-2">
                    {models.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelSelect(model)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedModel === model
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Alt Modeller */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Varyantlar</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto border border-gray-200 dark:border-gray-600">
                {!selectedModel ? (
                  <div className="text-gray-500 dark:text-gray-400">Önce model seçiniz</div>
                ) : subModels.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">Varyant bulunamadı</div>
                ) : (
                  <div className="space-y-2">
                    {subModels.map((subModel) => (
                      <button
                        key={subModel}
                        onClick={() => setSelectedSubModel(subModel)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedSubModel === subModel
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {subModel}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ara Butonu */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSearch}
              disabled={!selectedBrand || !selectedModel || searching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {searching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Aranıyor...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Ara
                </>
              )}
            </button>
          </div>

          {/* Seçilen Motor Bilgisi */}
          {(selectedBrand || selectedModel) && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 dark:text-white">
                  <strong>Seçilen:</strong> {selectedBrand} {selectedModel} {selectedSubModel}
                </div>
                <button
                  onClick={resetSelection}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  Temizle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* İki Ayrı Sonuç Alanı */}
        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Bizim Aramamız */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bizim Aramamız</h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedBrand} {selectedModel} {selectedSubModel}
                </h3>
                <div className="text-gray-700 dark:text-gray-300 space-y-1">
                  <p><strong>Marka:</strong> {selectedBrand}</p>
                  <p><strong>Model:</strong> {selectedModel}</p>
                  {selectedSubModel && <p><strong>Varyant:</strong> {selectedSubModel}</p>}
                  <p><strong>Durum:</strong> Arama yapıldı</p>
                </div>
              </div>
            </div>

            {/* Sahibinden Sonuçlar */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sahibinden Sonuçlar ({searchResults.length} ilan)
              </h2>
              
              <div className="space-y-6 max-h-[500px] overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex gap-6">
                      {/* Sol taraf - Bilgiler */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
                            {result.title}
                          </h3>
                          <span className="text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                            {result.year}
                          </span>
                        </div>
                        
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500 mb-4">
                          {result.price}
                        </div>

                        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                              <Gauge className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              <span>{result.mileage.toLocaleString()} km</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                              <MapPin className="h-4 w-4 text-red-500 dark:text-red-400" />
                              <span>{result.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                              <Calendar className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                              <span>{result.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedCard(result);
                              setShowCardDetail(true);
                            }}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Detayları Gör
                          </button>
                          
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Sahibinden'de Gör
                          </a>
                        </div>
                      </div>

                      {/* Sağ taraf - Motor Görseli */}
                      <div className="w-48 h-36 flex-shrink-0">
                        <img
                          src="/src/moto-image.jpg"
                          alt={result.title}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-300 dark:border-gray-500 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.src = "/src/moto-image.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kart Detay Modal */}
        {showCardDetail && selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">İlan Detayı</h2>
                <button
                  onClick={() => setShowCardDetail(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative border border-gray-200 dark:border-gray-600">
                  <img
                    src="/src/moto-image.jpg"
                    alt={selectedCard.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/src/moto-image.jpg";
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {selectedCard.year}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedCard.title}
                </h3>
                
                <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-6">
                  {selectedCard.price}
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    <span>{selectedCard.mileage.toLocaleString()} km</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{selectedCard.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>{selectedCard.date}</span>
                  </div>

                  <div className="text-gray-700 dark:text-gray-300">
                    <strong>Marka:</strong> {selectedCard.brand}
                  </div>
                </div>

                <a
                  href={selectedCard.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                  Sahibinden'de Gör
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Teknik Özellikler ve Fiyat Hesaplama */}
        {searchResults.length > 0 && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Fiyat Hesaplama</h2>

            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kilometre</label>
                <input
                  type="number"
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Kilometre giriniz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durum</label>
                <select 
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  <option value="new">Sıfır</option>
                  <option value="excellent">Mükemmel</option>
                  <option value="good">İyi</option>
                  <option value="fair">Orta</option>
                  <option value="poor">Kötü</option>
                </select>
              </div>
            </div>

            {/* Teknik Özellikler Dropdown */}
            <div className="space-y-4">
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setShowTechnical(!showTechnical)}
                  className="w-full flex items-center justify-between p-4 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium">Teknik Özellikler</span>
                  {showTechnical ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                
                {showTechnical && (
                  <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      Teknik özellikler buraya eklenecek (Motor gücü, hacmi, vites tipi vb.)
                    </div>
                  </div>
                )}
              </div>

              {/* Özellikler Dropdown */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setShowFeatures(!showFeatures)}
                  className="w-full flex items-center justify-between p-4 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium">Güvenlik ve Aksesuar Özellikleri</span>
                  {showFeatures ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                
                {showFeatures && (
                  <div className="p-4 border-t border-gray-300 dark:border-gray-600 space-y-4">
                    {/* Güvenlik */}
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium mb-3">Güvenlik</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                      <h4 className="text-gray-900 dark:text-white font-medium mb-3">Aksesuar</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                )}
              </div>

              {/* Hasar/Tramer Dropdown */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setShowDamage(!showDamage)}
                  className="w-full flex items-center justify-between p-4 text-left text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium">Hasar/Tramer Durumu</span>
                  {showDamage ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                
                {showDamage && (
                  <div className="p-4 border-t border-gray-300 dark:border-gray-600">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(damageStatus).map(([key, value]) => {
                        const partNames: {[key: string]: string} = {
                          'chassis': 'Şasi',
                          'engine': 'Motor',
                          'transmission': 'Şanzıman',
                          'frontFork': 'Ön Amortisör',
                          'fuelTank': 'Yakıt Deposu',
                          'electrical': 'Elektrik Sistemi',
                          'frontPanel': 'Ön Panel',
                          'rearPanel': 'Arka Panel',
                          'exhaust': 'Egzoz'
                        };
                        
                        return (
                          <div key={key} className="grid grid-cols-2 gap-4 items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {partNames[key] || key}
                            </span>
                            <select
                              className="rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={value.status}
                              onChange={(e) => handleDamageStatusChange(key, e.target.value)}
                            >
                              <option value="Orijinal">Orijinal</option>
                              <option value="Boyalı">Boyalı</option>
                              <option value="Değişen">Değişen</option>
                              <option value="Hasarlı">Hasarlı</option>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fiyat Hesapla Butonu */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCalculatePrice}
                disabled={calculating || !mileage || !condition}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {calculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Hesaplanıyor...
                  </>
                ) : (
                  <>
                    <CalcIcon className="h-5 w-5" />
                    Fiyat Hesapla
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Fiyat Hesaplama Sonucu */}
        {priceResult && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Hesaplama Sonucu</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sahibinden Ortalaması */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Sahibinden Ortalaması</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(priceResult.sahibindenAverage)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Piyasa verileri</p>
              </div>

              {/* Algoritma Sonucu */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Algoritma Sonucu</h3>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(priceResult.algorithmResult)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bizim hesaplama</p>
              </div>

              {/* Genel Sonuç */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center border-2 border-green-500">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Genel Sonuç</h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(priceResult.finalResult)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ortalama değer</p>
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              {selectedBrand} {selectedModel} {selectedSubModel} - {mileage} km - {condition}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}