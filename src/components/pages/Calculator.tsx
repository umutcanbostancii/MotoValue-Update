import {
  CalculatorIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Home,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Brand } from "../../types/Brand";
import { Model } from "../../types/Model";
import { useSignalR } from "../../SignalR/SignalRContext";
import { Dropdown } from "primereact/dropdown";
import { DamageStatus } from "../../types/DamageStatus";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Listing } from "../../types/Listing";
import { Steps } from "primereact/steps";
const API_URL = import.meta.env.VITE_API_URL;

const MySwal = withReactContent(Swal);

export function Calculator() {
  const conditionOptions = [
    { label: "İkinci El", value: "İkinci El" },
    { label: "Yurtdışından İthal Sıfır", value: "Yurtdışından İthal Sıfır" },
    { label: "Yetkili Bayiden Sıfır", value: "Yetkili Bayiden Sıfır" },
  ];
  const currentYear = new Date().getFullYear();

  const { connection } = useSignalR();

  const [loading, setLoading] = useState(true);
  const [sahibindenLoading, setSahibindenLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showOnlySahibindenPriceCard, setShowOnlySahibindenPriceCard] =
    useState(false);
  const [showSimpleList, setShowSimpleList] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [minYear, setMinYear] = useState<number | null>(null);
  const [maxYear, setMaxYear] = useState<number | null>(null);
  const [minMilage, setMinMilage] = useState<number | null>(null);
  const [maxMilage, setMaxMilage] = useState<number | null>(null);

  const [condition, setCondition] = useState<string>("İkinci El");

  const [damageStatus, setDamageStatus] = useState<DamageStatus>({
    headFairing: { status: "1" },
    bottomFairing: { status: "1" },
    leftFairing: { status: "1" },
    rightFairing: { status: "1" },
    backFairing: { status: "1" },
    fuelTank: { status: "1" },
  });

  const stepperItems = [
    {
      label: "Motosiklet Seçimi",
    },
    {
      label: "Sahibinden Bilgisi",
    },
    {
      label: "Hasar Bilgisi",
    },
    {
      label: "Değerleme",
    },
  ];

  const [percentage, setPercentage] = useState(0);
  const [listingsLength, setListingsLength] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [stepBackIndex, setStepBackIndex] = useState(0);

  const [brandNewAverages, setBrandNewAverages] = useState<number>(0);
  const [initialBrandNewAverages, setInitialBrandNewAverages] =
    useState<number>(0);
  const [calculatedBrandNewAverages, setCalculatedBrandNewAverages] =
    useState<number>(0);

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

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!connection) return;

    const handleListings = (listings: Listing[]) => {
      const allKmBetween0And1000 = listings.every((listing) => {
        const km = parseInt(listing.km.replace(/\D/g, ""), 10);
        return km >= 0 && km <= 1000;
      });
      const calculatedMarketPrice = calculateMarketPriceAverage(listings);
      if (allKmBetween0And1000) {
        console.log(brandNewAverages);
        console.log(brandNewAverages);
        setInitialBrandNewAverages(calculatedMarketPrice);
        setBrandNewAverages(calculatedMarketPrice);
        setSahibindenLoading(false);
        setStepBackIndex(2);
      } else {
        setListings(listings);
        setListingsLength(listings.length);
        setAverages((prev) => ({
          ...prev,
          marketAveragePrice: calculatedMarketPrice,
        }));
        setSahibindenLoading(false);
        setStepBackIndex(1);
      }

      nextStep();
    };

    const handleError = (error: string) => {
      setSahibindenLoading(false);
      setShowResult(false);
      MySwal.fire({
        title: "Uyarı",
        text: error,
        icon: "warning",
        confirmButtonText: "Tamam",
      });
    };

    connection.on("ReceiveListings", handleListings);
    connection.on("ReceiveScrapeError", handleError);

    return () => {
      connection.off("ReceiveListings", handleListings);
      connection.off("ReceiveScrapeError", handleError);
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

  const getDataFromSahibinden = async (isUsed: boolean) => {
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
        minYear,
        maxYear,
        `${minMilage}-${maxMilage}`,
        condition,
        isUsed
      );
    } catch (error) {
      console.error("SignalR isteği hatası:", error);
    }
  };

  const clearSelection = () => {
    setAverages({
      marketAveragePrice: 0,
      algorithmAveragePrice: 0,
      generalAveragePrice: 0,
    });
    setDamageStatus({
      headFairing: { status: "1" },
      bottomFairing: { status: "1" },
      sideFairing: { status: "1" },
      backFairing: { status: "1" },
      fuelTank: { status: "1" },
    });
    setShowResult(false);
    setSelectedBrandId(null);
    setSelectedModelId(null);
    setMinMilage(0);
    setMaxMilage(0);
    setMinYear(0);
    setMaxYear(0);
    setCondition("");
    setListings([]);
    setShowSimpleList(false);
  };

  const calculateMarketPriceAverage = (listings: Listing[]) => {
    const marketAverage =
      listings.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9]/g, ""));
        return sum + price;
      }, 0) / listings.length;

    return marketAverage;
  };

  const handleDamageStatusChange = (key: string, value: string) => {
    setDamageStatus((prev) => ({
      ...prev,
      [key]: { status: value },
    }));
  };

  const calculateDamageStatus = () => {
    const multipliers: Record<string, number> = {
      "1": 0,
      "2": 0.05,
      "3": 0.1,
      "4": 0.75,
      "5": 0.78,
      "6": 0.95,
    };

    const partEffects: Record<string, number> = {
      headFairing: 0.04,
      bottomFairing: 0.0125,
      leftFairing: 0.0175,
      rightFairing: 0.0175,
      backFairing: 0.0125,
      fuelTank: 0.05,
    };

    const currentYear = new Date().getFullYear();
    const safeMaxYear = maxYear ?? currentYear;
    const safeMinYear = minYear ?? currentYear;
    const yearEffect =
      (100 - (currentYear - (safeMaxYear + safeMinYear) / 2) * 5) / 100;

    let totalEffect = 0;

    Object.keys(damageStatus).forEach((part) => {
      const status = damageStatus[part].status;

      const multiplier = multipliers[status] ?? 1;
      const effect = partEffects[part] ?? 0;

      totalEffect += effect * multiplier;
    });

    const calculatedBrandNewPrice = (1 - totalEffect) * initialBrandNewAverages;
    const finalBrandNewPrice = calculatedBrandNewPrice * yearEffect;

    const generalAveragePrice =
      (averages.marketAveragePrice + finalBrandNewPrice) / 2;

    setCalculatedBrandNewAverages(finalBrandNewPrice);
    setAverages((prev) => ({
      ...prev,
      generalAveragePrice: generalAveragePrice,
    }));
    setStepBackIndex(3);
    nextStep();
  };

  const handleCalculateProfit = () => {
    const factor = (100 + percentage) / 100;

    setCalculatedPrices({
      market: Number((averages.marketAveragePrice / factor).toFixed(2)),
      algorithm: Number((calculatedBrandNewAverages / factor).toFixed(2)),
      general: Number((averages.generalAveragePrice / factor).toFixed(2)),
    });
  };

  const profitCalculationModalType = () => {
    if (activeIndex === 1) {
      setShowOnlySahibindenPriceCard(true);
    } else {
      setShowOnlySahibindenPriceCard(false);
    }

    setVisible(true);
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

  const nextStep = () => {
    if (activeIndex < stepperItems.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const onStepSelect = (stepIndex: number) => {
    if (stepIndex > stepBackIndex) {
      return;
    }

    setActiveIndex(stepIndex);
  };

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
            {(condition ||
              (minMilage && minMilage !== 0) ||
              (maxMilage && maxMilage !== 0) ||
              minYear ||
              maxYear) && (
              <>
                <ChevronRight className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  {condition && (
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                      {condition}
                    </span>
                  )}
                  {minMilage && maxMilage && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                      {`${minMilage}-${maxMilage}`}
                    </span>
                  )}
                  {minYear && maxYear && (
                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                      {`${minYear}-${maxYear}`}
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
          <Steps
            model={stepperItems}
            activeIndex={activeIndex}
            onSelect={(e) => onStepSelect(e.index)}
            readOnly={false}
          />
          {activeIndex === 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-7">
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
                      value={
                        brands.find((b) => b.id === selectedBrandId) || null
                      }
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
                      value={
                        models.find((b) => b.id === selectedModelId) || null
                      }
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 p-4">
                    {/* Yıl Min */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yıl (Min)
                      </label>
                      <InputNumber
                        value={minYear}
                        onValueChange={(e) => setMinYear(e.value ?? 0)}
                        min={undefined}
                        max={currentYear}
                        useGrouping={false}
                        placeholder="Min Yıl"
                        className="w-full"
                        inputClassName="h-11 px-3 text-sm"
                      />
                    </div>

                    {/* Yıl Max */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yıl (Max)
                      </label>
                      <InputNumber
                        value={maxYear}
                        onValueChange={(e) => setMaxYear(e.value ?? 0)}
                        min={undefined}
                        max={currentYear}
                        useGrouping={false}
                        placeholder="Max Yıl"
                        className="w-full"
                        inputClassName="h-11 px-3 text-sm"
                      />
                    </div>

                    {/* KM Min */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kilometre (Min)
                      </label>
                      <InputNumber
                        value={minMilage}
                        onValueChange={(e) => setMinMilage(e.value ?? 0)}
                        min={undefined}
                        max={1000000}
                        mode="decimal"
                        useGrouping={true}
                        placeholder="Min KM"
                        locale="de-DE"
                        className="w-full"
                        inputClassName="h-11 px-3 text-sm"
                      />
                    </div>

                    {/* KM Max */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Kilometre (Max)
                      </label>
                      <InputNumber
                        value={maxMilage}
                        onValueChange={(e) => setMaxMilage(e.value ?? 0)}
                        min={undefined}
                        max={1000000}
                        mode="decimal"
                        useGrouping={true}
                        placeholder="Max KM"
                        locale="de-DE"
                        className="w-full"
                        inputClassName="h-11 px-3 text-sm"
                      />
                    </div>

                    {/* Araç Durumu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Araç Durumu
                      </label>
                      <Dropdown
                        value={condition}
                        options={conditionOptions}
                        onChange={(e) => setCondition(e.value)}
                        disabled
                        placeholder="Seçiniz"
                        className="w-full"
                        panelClassName="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Ara Butonu */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => getDataFromSahibinden(true)}
                  disabled={
                    !selectedBrandId ||
                    !selectedModelId ||
                    !minYear ||
                    !maxYear ||
                    !minMilage ||
                    !maxMilage ||
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
            </>
          )}
          {activeIndex === 1 && (
            <>
              {/* Fiyat Sonuç Alanı */}
              <div className="flex items-center justify-end mb-4 mt-7">
                <Button
                  label="Kar Hesapla"
                  icon="pi pi-external-link"
                  onClick={() => profitCalculationModalType()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                />
              </div>
              {/* Tramer/Hasar Bilgileri */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700 mt-7 mb-6">
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                  Sahibinden Ortalama
                </h3>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(averages.marketAveragePrice)}
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {listingsLength} ilan ortalaması
                </p>
              </div>

              <div className="flex items-center justify-center mt-5">
                <Button
                  label={
                    sahibindenLoading
                      ? "Sahibinden'den Çekiliyor..."
                      : "Hasar Bilgisi"
                  }
                  icon={
                    sahibindenLoading
                      ? "pi pi-spinner pi-spin"
                      : "pi pi-calculator"
                  }
                  disabled={sahibindenLoading}
                  onClick={() =>
                    sahibindenLoading ? undefined : getDataFromSahibinden(false)
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                />
              </div>

              <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                Fiyatlar {brands.find((x) => x.id === selectedBrandId)?.name}{" "}
                {models.find((x) => x.id === selectedModelId)?.name} modeli için
                hesaplanmıştır
              </div>

              {/* Sahibinden Sonuçlar - Kollaps Buton */}
              {listings.length > 0 && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mt-7">
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
                                {
                                  brands.find((x) => x.id === selectedBrandId)
                                    ?.name
                                }{" "}
                                {
                                  models.find((x) => x.id === selectedModelId)
                                    ?.name
                                }{" "}
                                • {listing.year} • {listing.km} km •{" "}
                                {listing.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-green-600 dark:text-green-500 font-semibold text-sm">
                                {listing.price}
                              </div>
                              <a
                                href={`https://sahibinden.com${listing.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
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

              {/* Sonuç Yoksa */}
              {showResult && listings.length === 0 && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Sonuç Bulunamadı
                    </h3>
                    <p className="text-sm">
                      Arama kriterlerinize uygun ilan bulunamadı. Lütfen
                      filtrelerinizi gözden geçirin.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {activeIndex === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
                {Object.entries(damageStatus).map(([key, value]) => {
                  const partNames: { [key: string]: string } = {
                    headFairing: "Kafa Grenajı",
                    bottomFairing: "Alt Grenaj",
                    leftFairing: "Sol Grenaj",
                    rightFairing: "Sağ Grenaj",
                    backFairing: "Arka Grenaj",
                    fuelTank: "Yakıt Deposu",
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
                        <option value="1">Orijinal</option>
                        <option value="2">Orijinal Değişen</option>
                        <option value="3">Orijinal Boyalı</option>
                        <option value="4">Yan Sanayi</option>
                        <option value="5">Yan Sanayi Boyalı</option>
                        <option value="6">Hasarlı</option>
                      </select>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center mt-5">
                <Button
                  label="Tramerli Fiyat Hesapla"
                  icon="pi pi-calculator"
                  onClick={calculateDamageStatus}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                />
              </div>
            </>
          )}
          {activeIndex === 3 && (
            <>
              {/* Fiyat Sonuç Alanı */}
              <div className="flex items-center justify-end mb-4 mt-7">
                <Button
                  label="Kar Hesapla"
                  icon="pi pi-external-link"
                  onClick={() => profitCalculationModalType()}
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
                    {listingsLength} ilan ortalaması
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700">
                  <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2">
                    Algoritma Fiyatı
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(calculatedBrandNewAverages)}
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
            </>
          )}
        </div>
      </div>
      <Dialog
        draggable={false}
        header="Kar Hesaplaması"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={handleClose}
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
              {!showOnlySahibindenPriceCard ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sahibinden Ortalama */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700">
                    <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                      Sahibinden Ortalama
                    </h3>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(calculatedPrices.market)}
                    </div>
                  </div>

                  {/* Algoritma Ortalama */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center border border-orange-200 dark:border-orange-700">
                    <h3 className="text-lg font-medium text-orange-700 dark:text-orange-300 mb-2">
                      Algoritma Ortalama
                    </h3>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(calculatedPrices.algorithm)}
                    </div>
                  </div>

                  {/* Genel Ortalama */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border-2 border-green-500">
                    <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">
                      Genel Ortalama
                    </h3>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(calculatedPrices.general)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-2">
                    Sahibinden Ortalama
                  </h3>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculatedPrices.market)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
