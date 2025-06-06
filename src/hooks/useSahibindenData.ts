import { useState } from "react";

interface SahibindenListing {
  id: string;
  title: string;
  price: string;
  date: string;
  location: string;
  image: string;
  link: string;
  classifiedDetails: {
    brand: string;
    model: string;
    year: string;
    mileage: string;
    condition: string;
    engineCapacity: string;
    enginePower: string;
    cylinderCount: string;
    transmission: string;
    timingType: string;
    type: string;
    from: string;
    accessories: string[];
    securityFeatures: string[];
  };
}

export const useSahibindenData = () => {
  const [listings, setListings] = useState<SahibindenListing[]>([]);
  const [loading, setLoading] = useState(false);

  // JSON dosyasından veriyi oku
  const loadSahibindenData = async (): Promise<SahibindenListing[]> => {
    try {
      const response = await fetch("/data/sahibinden-veriler.json");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("JSON dosyası okunamadı:", error);
      // Fallback olarak mock data
      return mockData;
    }
  };

  // Mock Sahibinden verisi (JSON okunamazsa fallback)
  const mockData: SahibindenListing[] = [
    {
      id: "1249103143",
      title: "HATASIZ DÜŞÜK KM FUL PPF KAPLI AKSESUARLI DUCATİ SF V2 %20 KDV",
      price: "769.000 TL",
      date: "28 Mayıs",
      location: "İstanbul Üsküdar",
      image: "https://i0.shbdn.com/photos/10/31/43/lthmb_1249103143gy2.jpg",
      link: "/ilan/vasita-motosiklet-ducati-hatasiz-dusuk-km-ful-ppf-kapli-aksesuarli-ducati-sf-v2-20-kdv-1249103143/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2023",
        mileage: "6.001",
        condition: "İkinci El",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Sahibinden",
        accessories: ["LED Sinyal", "LED Stop"],
        securityFeatures: ["ABS", "Çekiş Kontrolü", "Quick Shifter"],
      },
    },
    {
      id: "1229759598",
      title: "Street Fighter V2 - Kredi kartı ödeme imkanı",
      price: "911.000 TL",
      date: "25 Mayıs",
      location: "Bursa Nilüfer",
      image: "https://i0.shbdn.com/photos/75/95/98/lthmb_1229759598t08.jpg",
      link: "/ilan/vasita-motosiklet-ducati-street-fighter-v2-kredi-karti-odeme-imkani-1229759598/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2024",
        mileage: "0",
        condition: "Yetkili Bayiden Sıfır",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Motosiklet Mağazasından",
        accessories: ["LED Sinyal", "LED Stop"],
        securityFeatures: ["ABS", "Çekiş Kontrolü", "İmmobilizer"],
      },
    },
    {
      id: "1247327043",
      title: "2023 MODEL DUCATİ STREETFIGHTER V2",
      price: "640.000 TL",
      date: "19 Mayıs",
      location: "Adana Kozan",
      image: "https://i0.shbdn.com/photos/32/70/43/lthmb_1247327043kw6.jpg",
      link: "/ilan/vasita-motosiklet-ducati-2023-model-ducati-streetfighter-v2-1247327043/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2023",
        mileage: "6.001",
        condition: "İkinci El",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Sahibinden",
        accessories: ["LED Sinyal", "LED Stop", "Xenon Far"],
        securityFeatures: ["ABS", "Çekiş Kontrolü", "İmmobilizer"],
      },
    },
    {
      id: "1247207737",
      title: "2022 Kasım çıkışlı Streetfighter V2 - 1113 Euro Aksesuarlı",
      price: "750.000 TL",
      date: "19 Mayıs",
      location: "Ankara Çankaya",
      image: "https://i0.shbdn.com/photos/20/77/37/lthmb_1247207737y2u.jpg",
      link: "/ilan/vasita-motosiklet-ducati-2022-kasim-cikisli-streetfighter-v2-1113-euro-aksesuarli-1247207737/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2022",
        mileage: "6.001",
        condition: "İkinci El",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Sahibinden",
        accessories: ["Karbon", "LED Sinyal", "LED Stop"],
        securityFeatures: [
          "ABS",
          "Çekiş Kontrolü",
          "İmmobilizer",
          "Quick Shifter",
        ],
      },
    },
    {
      id: "1246004538",
      title: "KORLAS ATAŞEHİRDEN STREETFİGHTER V2",
      price: "765.000 TL",
      date: "13 Mayıs",
      location: "İstanbul Ataşehir",
      image: "https://i0.shbdn.com/photos/00/45/38/lthmb_12460045382zd.jpg",
      link: "/ilan/vasita-motosiklet-ducati-korlas-atasehirden-streetfighter-v2-1246004538/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2023",
        mileage: "6.001",
        condition: "İkinci El",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Motosiklet Mağazasından",
        accessories: [],
        securityFeatures: [],
      },
    },
    {
      id: "1232330467",
      title: "DUCATI SÖNMEZLER ANKARA/Street Fighter V2",
      price: "911.680 TL",
      date: "02 Nisan",
      location: "Ankara Gölbaşı",
      image: "https://i0.shbdn.com/photos/33/04/67/lthmb_1232330467hd5.jpg",
      link: "/ilan/vasita-motosiklet-ducati-ducati-sonmezler-ankara-street-fighter-v2-1232330467/detay",
      classifiedDetails: {
        brand: "Ducati",
        model: "Streetfighter V2",
        year: "2024",
        mileage: "0",
        condition: "Yetkili Bayiden Sıfır",
        engineCapacity: "801 - 1000 cm3",
        enginePower: "151 - 175 hp",
        cylinderCount: "Çift Silindir",
        transmission: "Manuel",
        timingType: "4 Zamanlı",
        type: "Naked / Roadster",
        from: "Motosiklet Mağazasından",
        accessories: [],
        securityFeatures: [],
      },
    },
  ];

  const fetchSahibindenData = async (_filters: {
    brand: string;
    model: string;
    yearRange?: string;
    mileageRange?: string;
    condition?: string;
  }) => {
    setLoading(true);

    try {
      // JSON dosyasından verileri yükle
      const data = await loadSahibindenData();

      // Loading simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // JSON'daki tüm verileri göster (marka/model'den bağımsız)
      setListings(data);
      setLoading(false);

      return data;
    } catch (error) {
      console.error("Sahibinden verisi çekilemedi:", error);
      setLoading(false);
      return [];
    }
  };

  return {
    listings,
    loading,
    fetchSahibindenData,
  };
};
