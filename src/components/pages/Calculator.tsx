import {
  CalculatorIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Home,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Brand } from "../../types/Brand";
import { Model } from "../../types/Model";
import { useSignalR } from "../../SignalR/SignalRContext";
import { SahibindenListing } from "../../types/SahibindenListing";
import { Dropdown } from "primereact/dropdown";
import { DamageStatus } from "../../types/DamageStatus";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
const API_URL = import.meta.env.VITE_API_URL;

const MySwal = withReactContent(Swal);

export function Calculator() {
  const mileageRanges = useMemo(
    () => [
      // İlk 50k'da 5'er bin aralıklar
      { value: "0-5000", label: "0 - 5.000 km" },
      { value: "5001-10000", label: "5.001 - 10.000 km" },
      { value: "10001-15000", label: "10.001 - 15.000 km" },
      { value: "15001-20000", label: "15.001 - 20.000 km" },
      { value: "20001-25000", label: "20.001 - 25.000 km" },
      { value: "25001-30000", label: "25.001 - 30.000 km" },
      { value: "30001-35000", label: "30.001 - 35.000 km" },
      { value: "35001-40000", label: "35.001 - 40.000 km" },
      { value: "40001-45000", label: "40.001 - 45.000 km" },
      { value: "45001-50000", label: "45.001 - 50.000 km" },
      // 50k sonrası 10'ar bin aralıklar
      { value: "50001-60000", label: "50.001 - 60.000 km" },
      { value: "60001-70000", label: "60.001 - 70.000 km" },
      { value: "70001-80000", label: "70.001 - 80.000 km" },
      { value: "80001-90000", label: "80.001 - 90.000 km" },
      { value: "90001-100000", label: "90.001 - 100.000 km" },
      { value: "100001-110000", label: "100.001 - 110.000 km" },
      { value: "110001-120000", label: "110.001 - 120.000 km" },
      { value: "120001-130000", label: "120.001 - 130.000 km" },
      { value: "130001-140000", label: "130.001 - 140.000 km" },
      { value: "140001-150000", label: "140.001 - 150.000 km" },
      { value: "150001-160000", label: "150.001 - 160.000 km" },
      { value: "160001-170000", label: "160.001 - 170.000 km" },
      { value: "170001-180000", label: "170.001 - 180.000 km" },
      { value: "180001-190000", label: "180.001 - 190.000 km" },
      { value: "190001-200000", label: "190.001 - 200.000 km" },
      { value: "200001-210000", label: "200.001 - 210.000 km" },
      { value: "210001-220000", label: "210.001 - 220.000 km" },
      { value: "220001-230000", label: "220.001 - 230.000 km" },
      { value: "230001-240000", label: "230.001 - 240.000 km" },
      { value: "240001-250000", label: "240.001 - 250.000 km" },
      { value: "250001-260000", label: "250.001 - 260.000 km" },
      { value: "260001-270000", label: "260.001 - 270.000 km" },
      { value: "270001-280000", label: "270.001 - 280.000 km" },
      { value: "280001-290000", label: "280.001 - 290.000 km" },
      { value: "290001-300000", label: "290.001 - 300.000 km" },
    ],
    []
  );

  const { connection } = useSignalR();

  const [loading, setLoading] = useState(true);
  const [sahibindenLoading, setSahibindenLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSimpleList, setShowSimpleList] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [priceResult, setPriceResult] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [listings, setListings] = useState<SahibindenListing[]>([]);
  const [modalListing, setModalListing] = useState(
    null as SahibindenListing | null
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [yearRange, setYearRange] = useState<number | "">("");
  const [milageRange, setMilageRange] = useState<string | "">("");
  const [condition, setCondition] = useState<string>("");

  const [damageStatus, setDamageStatus] = useState<DamageStatus>({
    chassis: { status: "Orijinal" },
    engine: { status: "Orijinal" },
    transmission: { status: "Orijinal" },
    frontFork: { status: "Orijinal" },
    fuelTank: { status: "Orijinal" },
    electrical: { status: "Orijinal" },
    frontPanel: { status: "Orijinal" },
    rearPanel: { status: "Orijinal" },
    exhaust: { status: "Orijinal" },
  });

  const [percentage, setPercentage] = useState(0);

  const [averages, setAverages] = useState({
    marketAveragePrice: 0,
    algorithmAveragePrice: 0,
    generalAveragePrice: 0,
  });

  const [calculatedPrices, setCalculatedPrices] = useState<{
    market: number;
    algorithm: number;
    general: number;
  } | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 51 }, (_, i) => currentYear - i);

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!connection) return;

    const handler = (datas: SahibindenListing[]) => {
      setSahibindenLoading(false);
      if (datas.length === 0) {
        setShowResult(false);
        setPriceResult(false);
        return;
      }

      setListings(datas);
      const calculatedAverages = calculatePriceAverages(datas);
      setAverages(calculatedAverages);
      setShowResult(true);
      setPriceResult(true);
    };

    const handleError = (error: string) => {
      setSahibindenLoading(false);
      setShowResult(false);
      setPriceResult(false);
      MySwal.fire({
        title: "Hata",
        text: error,
        icon: "error",
        confirmButtonText: "Tamam",
      });
    };

    connection.on("ReceiveScrapedData", handler);
    connection.on("ReceiveScrapeError", handleError);

    return () => {
      connection.off("ReceiveScrapedData", handler);
      connection.off("ReceiveScrapeError", handler);
    };
  }, [connection]);

  const fetchBrands = async () => {
    fetch(`${API_URL}GeneralAPI/getmotorbrands`)
      .then((response) => response.json())
      .then((data) => {
        setBrands(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Markalar yüklenirken hata oluştu:", error);
        setLoading(false);
      });
  };

  const fetchModels = async (brandId: number) => {
    setLoading(true);
    fetch(`${API_URL}GeneralAPI/getmotormodelsbyid?id=${brandId}`)
      .then((response) => response.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Modeller yüklenirken hata oluştu:", error);
        setLoading(false);
      });
  };

  const handleBrandSelect = async (brandId: number) => {
    setSelectedBrandId(brandId);
    await fetchModels(brandId);
  };

  const handleModelSelect = (modelId: number) => {
    setSelectedModelId(modelId);
  };

  const getDataFromSahibinden = async () => {
    if (!connection) {
      console.error("SignalR bağlantısı kurulmadı!");
      return;
    }

    try {
      setSahibindenLoading(true);
      await connection.invoke(
        "RequestScrape",
        selectedBrandId,
        selectedModelId,
        yearRange,
        milageRange,
        condition
      );
    } catch (error) {
      console.error("SignalR isteği hatası:", error);
    }
  };

  const clearSelection = () => {
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setYearRange("");
    setMilageRange("");
    setCondition("");
    setListings([]);
    setShowSimpleList(false);
    setModalListing(null);
  };

  const showModal = (listing: SahibindenListing, show: boolean) => () => {
    if (show) {
      setShowDetailModal(show);
      setModalListing(listing);
    } else {
      setModalListing(null);
    }
  };

  const calculatePriceAverages = (motorcycleData: SahibindenListing[]) => {
    if (!motorcycleData || motorcycleData.length === 0) {
      return {
        marketAveragePrice: 0,
        algorithmAveragePrice: 0,
        generalAveragePrice: 0,
      };
    }

    const marketAverage =
      motorcycleData.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9]/g, ""));
        return sum + price;
      }, 0) / motorcycleData.length;

    const algorithmPrices = motorcycleData.map((item) => {
      const basePrice = parseFloat(item.price.replace(/[^0-9]/g, ""));

      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(item.detail.year);
      const yearDepreciation = Math.min(0.1 * age, 0.7);
      let price = basePrice * (1 - yearDepreciation);

      const mileage = parseInt(item.detail.mileage.replace(/[^0-9]/g, "")) || 0;
      const mileageDepreciation = Math.min((mileage / 10000) * 0.05, 0.3);
      price *= 1 - mileageDepreciation;

      const engineCC = parseInt(item.detail.engineCapacity.split(" ")[0]);
      if (engineCC > 1000) price *= 1.2;
      else if (engineCC > 750) price *= 1.15;
      else if (engineCC > 500) price *= 1.1;

      if (item.detail.type.includes("Sport")) price *= 1.15;
      else if (item.detail.type.includes("Adventure")) price *= 1.1;

      if (item.detail.accessories?.length) {
        price *= 1 + 0.05 * item.detail.accessories.length;
      }

      return Math.max(Math.min(price, basePrice * 1.5), basePrice * 0.4);
    });

    const algorithmAverage =
      algorithmPrices.reduce((sum, price) => sum + price, 0) /
      algorithmPrices.length;

    const generalAverage = (marketAverage + algorithmAverage) / 2;

    return {
      marketAveragePrice: marketAverage,
      algorithmAveragePrice: algorithmAverage,
      generalAveragePrice: generalAverage,
    };
  };

  const handleDamageStatusChange = (key: string, value: string) => {
    setDamageStatus((prev) => ({
      ...prev,
      [key]: { status: value },
    }));
    console.log("Damage status changed:", key, value);
  };

  const handleCalculateProfit = () => {
    const factor = (100 + percentage) / 100;

    setCalculatedPrices({
      market: Number((averages.marketAveragePrice / factor).toFixed(2)),
      algorithm: Number((averages.algorithmAveragePrice / factor).toFixed(2)),
      general: Number((averages.generalAveragePrice / factor).toFixed(2)),
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleClose = () => {
    setVisible(false);
    setPercentage(0);
    setCalculatedPrices(null);
  };

  const footerContent = (
    <div className="flex justify-end gap-2 px-4 py-2">
      <Button
        label="Hesapla"
        icon="pi pi-check"
        onClick={handleCalculateProfit}
        autoFocus
        className="bg-blue-600 text-white hover:bg-blue-700 font-medium py-2 px-4 rounded flex items-center gap-2"
      />
      <Button
        label="Kapat"
        icon="pi pi-times"
        onClick={handleClose}
        className="bg-red-600 text-white hover:bg-red-700 font-medium py-2 px-4 rounded flex items-center gap-2"
      />
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            <span>Fiyat Hesapla</span>
            {selectedBrandId && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {brands.find((brand) => brand.id === selectedBrandId)?.name ||
                    "Marka Seçin"}
                </span>
              </>
            )}
            {selectedModelId && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {models.find((model) => model.id === selectedModelId)?.name ||
                    "Model Seçin"}
                </span>
              </>
            )}
            {(condition || milageRange || yearRange) && (
              <>
                <ChevronRight className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  {condition && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                      {condition}
                    </span>
                  )}
                  {milageRange && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                      {milageRange}
                    </span>
                  )}
                  {yearRange && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                      {yearRange}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          <CalculatorIcon className="h-6 w-6 inline-block mr-2" />
          Fiyat Hesapla
        </h1>

        {/* Marka/Model/Alt Model Seçimi */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Motosiklet Seçimi
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Markalar */}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Markalar
              </h3>

              {loading ? (
                <div className="text-gray-500 dark:text-gray-400">
                  Yükleniyor...
                </div>
              ) : (
                <Dropdown
                  onChange={(e) => handleBrandSelect(e.value.id)}
                  value={brands.find((b) => b.id === selectedBrandId) || null}
                  options={brands}
                  optionLabel="name"
                  placeholder="Marka Seçin"
                  filter
                  className="w-full"
                />
              )}
            </div>

            {/* Modeller */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Modeller
              </h3>
              {!selectedBrandId ? (
                <div className="text-gray-500 dark:text-gray-400">
                  Önce marka seçiniz
                </div>
              ) : models.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">
                  Model bulunamadı
                </div>
              ) : (
                <Dropdown
                  onChange={(e) => handleModelSelect(e.value.id)}
                  value={models.find((b) => b.id === selectedModelId) || null}
                  options={models}
                  optionLabel="name"
                  placeholder="Model Seçin"
                  filter
                  className="w-full"
                />
              )}
            </div>
          </div>

          {/* Arama Filtreleri */}
          {selectedBrandId && selectedModelId && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sahibinden Arama Filtreleri
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yıl
                  </label>
                  <select
                    value={yearRange}
                    onChange={(e) =>
                      setYearRange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Yıl Seçin</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kilometre
                  </label>
                  <select
                    value={milageRange}
                    onChange={(e) =>
                      setMilageRange(
                        e.target.value === "" ? "" : e.target.value
                      )
                    }
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    {mileageRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Araç Durumu
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="İkinci El">İkinci El</option>
                    <option value="Yurtdışından İthal Sıfır">
                      Yurtdışından İthal Sıfır
                    </option>
                    <option value="Yetkili Bayiden Sıfır">
                      Yetkili Bayiden Sıfır
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Ara Butonu */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={getDataFromSahibinden}
              disabled={
                !selectedBrandId ||
                !selectedModelId ||
                !yearRange ||
                !milageRange ||
                !condition ||
                sahibindenLoading
              }
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
          {(selectedBrandId || selectedModelId) && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <div className="text-gray-900 dark:text-white">
                  <strong>Seçilen:</strong>{" "}
                  {brands.find((x) => x.id === selectedBrandId)?.name}{" "}
                  {models.find((x) => x.id === selectedModelId)?.name}{" "}
                </div>
                <button
                  onClick={clearSelection}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  Temizle
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sahibinden Sonuçlar - Kollaps Buton */}
        {listings.length > 0 && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setShowSimpleList(!showSimpleList)}
              className="w-full h-5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <span>Sahibinden Sonuçlar ({listings.length} ilan)</span>
              {showSimpleList ? (
                <ChevronUp className="h-3 w-3 ml-2" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-2" />
              )}
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
                          {listing.detail.brand} {listing.detail.model} •{" "}
                          {listing.detail.year} • {listing.detail.mileage} km •{" "}
                          {listing.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-green-600 dark:text-green-500 font-semibold text-sm">
                          {listing.price}
                        </div>
                        <button
                          onClick={showModal(listing, true)}
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
        {priceResult && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Fiyat Karşılaştırması
              </h2>

              <Button
                label="Kar Hesapla"
                icon="pi pi-external-link"
                onClick={() => setVisible(true)}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Sahibinden Ortalama
                </h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(averages.marketAveragePrice)}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {listings.length} ilan ortalaması
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700">
                <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2">
                  Algoritma Fiyatı
                </h3>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(averages.algorithmAveragePrice)}
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  Sistem hesaplaması
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border-2 border-green-500">
                <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
                  Genel Ortalama
                </h3>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(averages.generalAveragePrice)}
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Önerilen fiyat
                </p>
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              Fiyatlar {brands.find((x) => x.id === selectedBrandId)?.name}{" "}
              {models.find((x) => x.id === selectedModelId)?.name} modeli için
              hesaplanmıştır
            </div>
          </div>
        )}

        {/* Tramer/Hasar Bilgileri */}
        {showResult && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Tramer/Hasar Bilgileri
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(damageStatus).map(([key, value]) => {
                const partNames: { [key: string]: string } = {
                  chassis: "Şasi",
                  engine: "Motor",
                  transmission: "Şanzıman",
                  frontFork: "Ön Amortisör",
                  fuelTank: "Yakıt Deposu",
                  electrical: "Elektrik Sistemi",
                  frontPanel: "Ön Panel",
                  rearPanel: "Arka Panel",
                  exhaust: "Egzoz",
                };

                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {partNames[key] || key}
                    </label>
                    <select
                      value={value.status}
                      onChange={(e) =>
                        handleDamageStatusChange(key, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {showResult && listings.length === 0 && (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Sonuç Bulunamadı</h3>
              <p className="text-sm">
                Arama kriterlerinize uygun ilan bulunamadı. Lütfen
                filtrelerinizi gözden geçirin.
              </p>
            </div>
          </div>
        )}

        {/* Detay Modal */}
        {showDetailModal && modalListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  İlan Detayı
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 relative border border-gray-200 dark:border-gray-600 overflow-hidden">
                  <img
                    src={modalListing.image}
                    alt={modalListing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/src/moto-image.jpg";
                    }}
                  />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {modalListing.title}
                </h3>

                <div className="text-3xl font-bold text-green-600 dark:text-green-500 mb-6">
                  {modalListing.price}
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 mb-6">
                  <div>
                    <strong>Marka:</strong> {modalListing.detail.brand}
                  </div>
                  <div>
                    <strong>Model:</strong> {modalListing.detail.model}
                  </div>
                  <div>
                    <strong>Yıl:</strong> {modalListing.detail.year}
                  </div>
                  <div>
                    <strong>Kilometre:</strong> {modalListing.detail.mileage} km
                  </div>
                  <div>
                    <strong>Durum:</strong> {modalListing.detail.condition}
                  </div>
                  <div>
                    <strong>Motor Hacmi:</strong>{" "}
                    {modalListing.detail.engineCapacity}
                  </div>
                  <div>
                    <strong>Motor Gücü:</strong>{" "}
                    {modalListing.detail.enginePower}
                  </div>
                  <div>
                    <strong>Tip:</strong> {modalListing.detail.type}
                  </div>
                  <div>
                    <strong>Konum:</strong> {modalListing.location}
                  </div>
                  <div>
                    <strong>Tarih:</strong> {modalListing.date}
                  </div>
                </div>

                {modalListing.detail.securityFeatures.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Güvenlik Özellikleri
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {modalListing.detail.securityFeatures.map(
                        (feature, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                {modalListing.detail.accessories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Aksesuarlar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {modalListing.detail.accessories.map(
                        (accessory, index) => (
                          <span
                            key={index}
                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm"
                          >
                            {accessory}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

                <a
                  href={`https://sahibinden.com${modalListing.link}`}
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
      <Dialog
        draggable={false}
        header="Kar Hesaplaması"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
        className="p-0"
      >
        <div className="p-6 space-y-4">
          {/* Yüzdelik Girişi */}
          <div>
            <label
              htmlFor="percent"
              className="block text-sm font-medium text-white-700 dark:text-white-300 mb-2"
            >
              Yüzdelik (%)
            </label>
            <InputNumber
              inputId="percent"
              value={percentage}
              onValueChange={(e) => setPercentage(e.value || 0)}
              prefix="%"
              className="w-full"
              inputClassName="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Hesaplanan Fiyatlar */}
          {calculatedPrices && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-white-800 dark:text-white-200">
                Hesaplanan Fiyatlar
              </h3>

              {/* Açıklama */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Girilen yüzdelik değer doğrultusunda her ortalama fiyat,
                belirtilen oranda kâr edecek şekilde geriye dönük olarak
                hesaplanmıştır. Bu sayede ürününüzün, belirlediğiniz kâr marjı
                ile satıldığında hangi maliyetlerle alınması gerektiğini
                görebilirsiniz.
              </p>

              {/* Fiyat Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Sahibinden Ortalama
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculatedPrices.market)}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700">
                  <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2">
                    Algoritma Ortalama
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(calculatedPrices.algorithm)}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border-2 border-green-500">
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
                    Genel Ortalama
                  </h3>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(calculatedPrices.general)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
