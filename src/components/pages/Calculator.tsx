import { useEffect, useMemo, useCallback, useReducer } from 'react';
import { Calculator as CalcIcon, Search, ChevronDown, ChevronUp, ExternalLink, X, Home, ChevronRight } from 'lucide-react';
import { useSahibindenData, SahibindenListing } from '../../hooks/useSahibindenData';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface SearchFilters {
  brand: string;
  model: string;
  yearRange: string;
  mileageRange: string;
  condition: string;
}

interface DamageStatus {
  [key: string]: { status: string };
}

interface PriceResult {
  sahibindenAverage: number;
  algorithmResult: number;
  finalResult: number;
}

// State Management için yeni tipler
interface CalculatorState {
  // Data states
  brands: string[];
  models: string[];
  subModels: string[];
  
  // Selection states
  selectedBrand: string;
  selectedModel: string;
  selectedSubModel: string;
  
  // Filter states
  filters: SearchFilters;
  condition: string;
  damageStatus: DamageStatus;
  
  // UI states
  loading: boolean;
  showResults: boolean;
  showSimpleList: boolean;
  showDetailModal: boolean;
  selectedListing: SahibindenListing | null;
  
  // Result state
  priceResult: PriceResult | null;
}

// Action types
type CalculatorAction =
  | { type: 'SET_BRANDS'; payload: string[] }
  | { type: 'SET_MODELS'; payload: string[] }
  | { type: 'SET_SUBMODELS'; payload: string[] }
  | { type: 'SELECT_BRAND'; payload: string }
  | { type: 'SELECT_MODEL'; payload: string }
  | { type: 'SELECT_SUBMODEL'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_FILTER'; payload: { key: keyof SearchFilters; value: string } }
  | { type: 'SET_CONDITION'; payload: string }
  | { type: 'UPDATE_DAMAGE_STATUS'; payload: { key: string; value: string } }
  | { type: 'SET_SHOW_RESULTS'; payload: boolean }
  | { type: 'SET_SHOW_SIMPLE_LIST'; payload: boolean }
  | { type: 'SET_SHOW_DETAIL_MODAL'; payload: boolean }
  | { type: 'SET_SELECTED_LISTING'; payload: SahibindenListing | null }
  | { type: 'SET_PRICE_RESULT'; payload: PriceResult | null }
  | { type: 'RESET_SELECTION' }
  | { type: 'RESET_MODELS' };

// Reducer function
const calculatorReducer = (state: CalculatorState, action: CalculatorAction): CalculatorState => {
  switch (action.type) {
    case 'SET_BRANDS':
      return { ...state, brands: action.payload };
    
    case 'SET_MODELS':
      return { ...state, models: action.payload };
    
    case 'SET_SUBMODELS':
      return { ...state, subModels: action.payload };
    
    case 'SELECT_BRAND':
      return { 
        ...state, 
        selectedBrand: action.payload,
        selectedModel: '',
        selectedSubModel: '',
        models: [],
        subModels: []
      };
    
    case 'SELECT_MODEL':
      return { 
        ...state, 
        selectedModel: action.payload,
        selectedSubModel: '',
        subModels: []
      };
    
    case 'SELECT_SUBMODEL':
      return { ...state, selectedSubModel: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };
    
    case 'SET_CONDITION':
      return { ...state, condition: action.payload };
    
    case 'UPDATE_DAMAGE_STATUS':
      return {
        ...state,
        damageStatus: {
          ...state.damageStatus,
          [action.payload.key]: { status: action.payload.value }
        }
      };
    
    case 'SET_SHOW_RESULTS':
      return { ...state, showResults: action.payload };
    
    case 'SET_SHOW_SIMPLE_LIST':
      return { ...state, showSimpleList: action.payload };
    
    case 'SET_SHOW_DETAIL_MODAL':
      return { ...state, showDetailModal: action.payload };
    
    case 'SET_SELECTED_LISTING':
      return { ...state, selectedListing: action.payload };
    
    case 'SET_PRICE_RESULT':
      return { ...state, priceResult: action.payload };
    
    case 'RESET_MODELS':
      return { 
        ...state, 
        models: [], 
        subModels: [],
        selectedModel: '',
        selectedSubModel: ''
      };
    
    case 'RESET_SELECTION':
      return {
        ...state,
        selectedBrand: '',
        selectedModel: '',
        selectedSubModel: '',
        models: [],
        subModels: [],
        showResults: false,
        showSimpleList: false,
        priceResult: null,
        filters: {
          brand: '',
          model: '',
          yearRange: '',
          mileageRange: '',
          condition: ''
        }
      };
    
    default:
      return state;
  }
};

export function Calculator() {
  // Sahibinden hook
  const { listings, loading: sahibindenLoading, fetchSahibindenData } = useSahibindenData();
  
  // Initial state for useReducer
  const initialState: CalculatorState = {
    // Data states
    brands: [],
    models: [],
    subModels: [],
    
    // Selection states
    selectedBrand: '',
    selectedModel: '',
    selectedSubModel: '',
    
    // Filter states
    filters: {
      brand: '',
      model: '',
      yearRange: '',
      mileageRange: '',
      condition: ''
    },
    condition: '',
    damageStatus: {
      chassis: { status: 'Orijinal' },
      engine: { status: 'Orijinal' },
      transmission: { status: 'Orijinal' },
      frontFork: { status: 'Orijinal' },
      fuelTank: { status: 'Orijinal' },
      electrical: { status: 'Orijinal' },
      frontPanel: { status: 'Orijinal' },
      rearPanel: { status: 'Orijinal' },
      exhaust: { status: 'Orijinal' },
    },
    
    // UI states
    loading: false,
    showResults: false,
    showSimpleList: false,
    showDetailModal: false,
    selectedListing: null,
    
    // Result state
    priceResult: null,
  };

  // useReducer kullanımı - tek merkezi state yönetimi ✅
  const [state, dispatch] = useReducer(calculatorReducer, initialState);
  
  // State destructuring for easier access
  const {
    brands,
    models,
    subModels,
    selectedBrand,
    selectedModel,
    selectedSubModel,
    loading,
    filters,
    condition,
    damageStatus,
    showResults,
    showSimpleList,
    showDetailModal,
    selectedListing,
    priceResult
  } = state;

  // Dropdown seçenekleri - useMemo ile optimize edildi
  const mileageRanges = useMemo(() => [
    // İlk 50k'da 5'er bin aralıklar
    { value: '0-5000', label: '0 - 5.000 km' },
    { value: '5001-10000', label: '5.001 - 10.000 km' },
    { value: '10001-15000', label: '10.001 - 15.000 km' },
    { value: '15001-20000', label: '15.001 - 20.000 km' },
    { value: '20001-25000', label: '20.001 - 25.000 km' },
    { value: '25001-30000', label: '25.001 - 30.000 km' },
    { value: '30001-35000', label: '30.001 - 35.000 km' },
    { value: '35001-40000', label: '35.001 - 40.000 km' },
    { value: '40001-45000', label: '40.001 - 45.000 km' },
    { value: '45001-50000', label: '45.001 - 50.000 km' },
    // 50k sonrası 10'ar bin aralıklar
    { value: '50001-60000', label: '50.001 - 60.000 km' },
    { value: '60001-70000', label: '60.001 - 70.000 km' },
    { value: '70001-80000', label: '70.001 - 80.000 km' },
    { value: '80001-90000', label: '80.001 - 90.000 km' },
    { value: '90001-100000', label: '90.001 - 100.000 km' },
    { value: '100001-110000', label: '100.001 - 110.000 km' },
    { value: '110001-120000', label: '110.001 - 120.000 km' },
    { value: '120001-130000', label: '120.001 - 130.000 km' },
    { value: '130001-140000', label: '130.001 - 140.000 km' },
    { value: '140001-150000', label: '140.001 - 150.000 km' },
    { value: '150001-160000', label: '150.001 - 160.000 km' },
    { value: '160001-170000', label: '160.001 - 170.000 km' },
    { value: '170001-180000', label: '170.001 - 180.000 km' },
    { value: '180001-190000', label: '180.001 - 190.000 km' },
    { value: '190001-200000', label: '190.001 - 200.000 km' },
    { value: '200001-210000', label: '200.001 - 210.000 km' },
    { value: '210001-220000', label: '210.001 - 220.000 km' },
    { value: '220001-230000', label: '220.001 - 230.000 km' },
    { value: '230001-240000', label: '230.001 - 240.000 km' },
    { value: '240001-250000', label: '240.001 - 250.000 km' },
    { value: '250001-260000', label: '250.001 - 260.000 km' },
    { value: '260001-270000', label: '260.001 - 270.000 km' },
    { value: '270001-280000', label: '270.001 - 280.000 km' },
    { value: '280001-290000', label: '280.001 - 290.000 km' },
    { value: '290001-300000', label: '290.001 - 300.000 km' }
  ], []);

  // 1980'den bugüne kadar tüm yıllar - useMemo ile optimize edildi
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = [];
    for (let year = currentYear; year >= 1980; year--) {
      yearArray.push({ value: year.toString(), label: year.toString() });
    }
    return yearArray;
  }, []);

  // Breadcrumb için optimize edilmiş mileage label lookup - useMemo ile cache edildi
  const selectedMileageLabel = useMemo(() => {
    return filters.mileageRange ? mileageRanges.find(r => r.value === filters.mileageRange)?.label : '';
  }, [filters.mileageRange, mileageRanges]);

  // ESKİ SİSTEM FONKSİYONLARI
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data, error } = await supabase
        .from('motorcycles')
        .select('brand')
        .order('brand', { ascending: true });

      if (error) throw error;

      const uniqueBrands = Array.from(new Set(data.map(m => m.brand))).sort();
      dispatch({ type: 'SET_BRANDS', payload: uniqueBrands });
    } catch (error) {
      console.error('Markalar yüklenirken hata:', error);
      toast.error('Markalar yüklenirken bir hata oluştu');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleBrandSelect = useCallback(async (brand: string) => {
    dispatch({ type: 'SELECT_BRAND', payload: brand });
    
    try {
      const { data, error } = await supabase
      .from('motorcycles')
      .select('model')
      .eq('brand', brand)
      .order('model', { ascending: true });

      if (error) throw error;

      const uniqueModels = Array.from(new Set(data.map(m => m.model))).sort();
      dispatch({ type: 'SET_MODELS', payload: uniqueModels });
    } catch (error) {
      console.error('Modeller yüklenirken hata:', error);
      toast.error('Modeller yüklenirken bir hata oluştu');
    }
  }, []);

  const handleModelSelect = useCallback(async (model: string) => {
    dispatch({ type: 'SELECT_MODEL', payload: model });

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
        dispatch({ type: 'SET_SUBMODELS', payload: variants });
      }
    } catch (error) {
      console.error('Alt modeller yüklenirken hata:', error);
    }
  }, [selectedBrand]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { key, value } });
  }, []);

  const handleSearch = async () => {
    if (!selectedBrand || !selectedModel) {
      toast.error('Lütfen marka ve model seçiniz');
        return;
      }

    try {
      // Sahibinden araması için filtreleri hazırla
      const searchFilters = {
        brand: selectedBrand,
        model: selectedModel,
        yearRange: filters.yearRange,
        mileageRange: filters.mileageRange,
        condition: filters.condition
      };
      
      await fetchSahibindenData(searchFilters);
      dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
      toast.success(`${listings.length} ilan bulundu`);
    } catch (error) {
      console.error('Arama hatası:', error);
      toast.error('Arama sırasında bir hata oluştu');
    }
  };

  const handleCalculatePrice = async () => {
    if (!selectedBrand || !selectedModel || !filters.mileageRange || !condition) {
      toast.error('Lütfen gerekli alanları doldurunuz');
      return;
    }

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
      
      // Kilometre aralığından ortalama değer çıkar
      const mileageValue = filters.mileageRange ? 
        parseInt(filters.mileageRange.split('-')[1]) || 50000 : 50000;

      // RPC fonksiyonunu çağır
      const { data: calculationData, error: calculationError } = await supabase
        .rpc('calculate_motorcycle_price', {
          input_motorcycle_id: motorcycleData.id,
          input_mileage: mileageValue,
          input_condition: condition,
          input_damage_status: damageStatus
        });

      if (calculationError) {
        throw new Error(calculationError.message);
      }

      if (!calculationData) {
        throw new Error('Hesaplama yapılamadı');
      }

      // Sahibinden ortalaması hesapla
      const sahibindenAverage = listings.length > 0 ? 
        listings.map(listing => parseInt(listing.price.replace(/[^\d]/g, ''))).reduce((a, b) => a + b, 0) / listings.length :
        425000; // Varsayılan değer

      const algorithmResult = calculationData.calculated_price;
      const finalResult = Math.round((sahibindenAverage + algorithmResult) / 2);

      dispatch({ type: 'SET_PRICE_RESULT', payload: {
        sahibindenAverage,
        algorithmResult,
        finalResult
      } });

      toast.success('Fiyat hesaplama tamamlandı!');
    } catch (error: any) {
        console.error('Hesaplama hatası:', error);
        toast.error(error.message || 'Fiyat hesaplanırken bir hata oluştu');
      }
  };

  const calculatePrices = useCallback(() => {
    if (listings.length === 0) return;

    // Sahibinden ortalama fiyat hesaplama
    const prices = listings.map(listing => {
      const priceStr = listing.price.replace(/[^\d]/g, '');
      return parseInt(priceStr);
    });

    const sahibindenAverage = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Mock algoritma fiyatı (gerçek sistemde RPC çağrısı yapılacak)
    const mockAlgorithmPrice = sahibindenAverage * 0.95; // %5 daha düşük

    // Genel ortalama
    const finalResult = (sahibindenAverage + mockAlgorithmPrice) / 2;

    dispatch({ type: 'SET_PRICE_RESULT', payload: {
      sahibindenAverage,
      algorithmResult: mockAlgorithmPrice,
      finalResult
    } });
  }, [listings]);

  const handleDamageStatusChange = useCallback((key: string, value: string) => {
    dispatch({ type: 'UPDATE_DAMAGE_STATUS', payload: { key, value } });
    
    // Tramer bilgisi değiştiğinde otomatik fiyat hesapla
    if (selectedBrand && selectedModel && filters.mileageRange && condition) {
      const timeoutId = setTimeout(() => {
        handleCalculatePrice();
      }, 100);
      
      // Memory leak önlemek için cleanup
      return () => clearTimeout(timeoutId);
    }
  }, [selectedBrand, selectedModel, filters.mileageRange, condition, handleCalculatePrice]);

  // Fiyat hesaplama otomatik olarak yapılsın
  useEffect(() => {
    if (listings.length > 0) {
      calculatePrices();
    }
  }, [listings, calculatePrices]);

  const resetSelection = useCallback(() => {
    dispatch({ type: 'RESET_SELECTION' });
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        {(selectedBrand || selectedModel || filters.condition || filters.mileageRange || filters.yearRange) && (
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <span>Fiyat Hesapla</span>
              {selectedBrand && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 dark:text-white font-medium">{selectedBrand}</span>
                </>
              )}
              {selectedModel && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900 dark:text-white font-medium">{selectedModel}</span>
                </>
              )}
              {(filters.condition || filters.mileageRange || filters.yearRange) && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <div className="flex items-center space-x-2">
                    {filters.condition && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                        {filters.condition}
                      </span>
                    )}
                    {filters.mileageRange && (
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                        {selectedMileageLabel}
                      </span>
                    )}
                    {filters.yearRange && (
                      <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                        {filters.yearRange}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
                        onClick={() => dispatch({ type: 'SELECT_SUBMODEL', payload: subModel })}
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

          {/* Arama Filtreleri */}
          {(selectedBrand && selectedModel) && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sahibinden Arama Filtreleri</h3>
              
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Yıl */}
              <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yıl</label>
                <select
                     value={filters.yearRange}
                     onChange={(e) => handleFilterChange('yearRange', e.target.value)}
                     className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                     <option value="">Seçiniz</option>
                     {years.map(year => (
                       <option key={year.value} value={year.value}>{year.label}</option>
                     ))}
                </select>
              </div>

                 {/* Kilometre Aralığı */}
              <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kilometre</label>
                <select
                     value={filters.mileageRange}
                     onChange={(e) => handleFilterChange('mileageRange', e.target.value)}
                     className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="">Seçiniz</option>
                     {mileageRanges.map(range => (
                       <option key={range.value} value={range.value}>{range.label}</option>
                     ))}
                </select>
              </div>

                 {/* Araç Durumu */}
              <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Araç Durumu</label>
                <select
                     value={condition}
                     onChange={(e) => dispatch({ type: 'SET_CONDITION', payload: e.target.value })}
                     className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                     <option value="">Seçiniz</option>
                     <option value="secondhand">İkinci El</option>
                     <option value="imported_new">Yurtdışından İthal Sıfır</option>
                     <option value="dealer_new">Yetkili Bayiden Sıfır</option>
                </select>
              </div>
              </div>
            </div>
          )}

          {/* Ara Butonu */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSearch}
              disabled={!selectedBrand || !selectedModel || !filters.yearRange || !filters.mileageRange || !condition || sahibindenLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {sahibindenLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Sahibinden'den Çekiliyor...
                </>
              ) : (
                <>
                                <Search className="h-5 w-5" />
              Fiyat Hesapla
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

        {/* Sahibinden Sonuçlar - Kollaps Buton */}
        {showResults && listings.length > 0 && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => dispatch({ type: 'SET_SHOW_SIMPLE_LIST', payload: !showSimpleList })}
              className="w-full h-5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span>Sahibinden Sonuçlar ({listings.length} ilan)</span>
              {showSimpleList ? <ChevronUp className="h-3 w-3 ml-2" /> : <ChevronDown className="h-3 w-3 ml-2" />}
            </button>
            
            {showSimpleList && (
              <div className="p-4">
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {listing.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {listing.classifiedDetails.brand} {listing.classifiedDetails.model} • {listing.classifiedDetails.year} • {listing.classifiedDetails.mileage} km • {listing.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-green-600 dark:text-green-500 font-semibold text-sm">
                          {listing.price}
                        </div>
                        <button
                          onClick={() => {
                            dispatch({ type: 'SET_SELECTED_LISTING', payload: listing });
                            dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: true });
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Kartı Aç
                        </button>
                        <a
                          href={`https://sahibinden.com${listing.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Git
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fiyat Sonuç Alanı */}
        {priceResult && showResults && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Fiyat Karşılaştırması</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sahibinden Ortalaması */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">Sahibinden Ortalama</h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(priceResult.sahibindenAverage)}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{listings.length} ilan ortalaması</p>
              </div>

              {/* Algoritma Sonucu */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700">
                <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2">Algoritma Fiyatı</h3>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(priceResult.algorithmResult)}
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Sistem hesaplaması</p>
              </div>

              {/* Genel Ortalama */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border-2 border-green-500">
                <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">Genel Ortalama</h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                  }).format(priceResult.finalResult)}
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Önerilen fiyat</p>
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              Fiyatlar {selectedBrand} {selectedModel} {selectedSubModel} modeli için hesaplanmıştır
            </div>
          </div>
        )}

        {/* Tramer/Hasar Bilgileri */}
        {showResults && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Tramer/Hasar Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {partNames[key] || key}
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Sonuç Yoksa */}
        {showResults && listings.length === 0 && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Sonuç Bulunamadı</h3>
              <p className="text-sm">Arama kriterlerinize uygun ilan bulunamadı. Lütfen filtrelerinizi gözden geçirin.</p>
            </div>
          </div>
        )}

        {/* Detay Modal */}
        {showDetailModal && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">İlan Detayı</h2>
                <button
                  onClick={() => dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: false })}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <img
                    src={selectedListing.image}
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/src/moto-image.jpg";
                    }}
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {selectedListing.title}
                </h3>
                
                <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-6">
                  {selectedListing.price}
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-6">
                  <div><strong>Marka:</strong> {selectedListing.classifiedDetails.brand}</div>
                  <div><strong>Model:</strong> {selectedListing.classifiedDetails.model}</div>
                  <div><strong>Yıl:</strong> {selectedListing.classifiedDetails.year}</div>
                  <div><strong>Kilometre:</strong> {selectedListing.classifiedDetails.mileage} km</div>
                  <div><strong>Durum:</strong> {selectedListing.classifiedDetails.condition}</div>
                  <div><strong>Motor Hacmi:</strong> {selectedListing.classifiedDetails.engineCapacity}</div>
                  <div><strong>Motor Gücü:</strong> {selectedListing.classifiedDetails.enginePower}</div>
                  <div><strong>Tip:</strong> {selectedListing.classifiedDetails.type}</div>
                  <div><strong>Konum:</strong> {selectedListing.location}</div>
                  <div><strong>Tarih:</strong> {selectedListing.date}</div>
                </div>

                {selectedListing.classifiedDetails.securityFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Güvenlik Özellikleri</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.classifiedDetails.securityFeatures.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedListing.classifiedDetails.accessories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Aksesuarlar</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.classifiedDetails.accessories.map((accessory, index) => (
                        <span
                          key={index}
                          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                        >
                          {accessory}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={`https://sahibinden.com${selectedListing.link}`}
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
      </div>
    </div>
  );
}