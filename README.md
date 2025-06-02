# MotoValue Update

Motosiklet değerleme ve fiyat hesaplama sistemi - Modern web uygulaması

## 🚀 Proje Özeti

MotoValue, motosiklet sahipleri ve alıcıları için geliştirilmiş kapsamlı bir değerleme platformudur. Gelişmiş algoritma ve gerçek piyasa verilerini kullanarak doğru fiyat tahminleri sunar.

## ✨ Özellikler

### 🎯 Ana Özellikler
- **Akıllı Fiyat Hesaplama**: Algoritma tabanlı ve Sahibinden verilerini birleştiren hibrit sistem
- **3 Katmanlı Seçim Sistemi**: Marka → Model → Varyant hiyerarşik seçimi
- **Gerçek Zamanlı Piyasa Verileri**: Sahibinden.com entegrasyonu ile güncel ilan verileri
- **Tramer/Hasar Değerlendirmesi**: 9 farklı parça için detaylı hasar durumu analizi
- **Responsive Tasarım**: Mobil ve desktop uyumlu modern arayüz

### 🔧 Gelişmiş Özellikler
- **Otomatik Fiyat Güncelleme**: Tramer bilgisi değişince anlık hesaplama
- **Karşılaştırmalı Fiyatlandırma**: Sahibinden ortalaması, algoritma sonucu ve genel ortalama
- **Filtreleme Sistemi**: Yıl, kilometre aralığı ve araç durumu filtreleri
- **Detaylı Modal Görünüm**: İlan detayları için popup ekranı
- **Breadcrumb Navigasyon**: Seçim sürecini gösteren yol haritası

### 🎨 UI/UX İyileştirmeleri (Son Güncellemeler)
- **3 Kolonlu Grid Layout**: Optimal görsel dengeleme
- **Collapsible Sonuç Alanı**: 20px yükseklikte minimal başlık
- **Türkçe Araç Durumu Seçenekleri**: İkinci El, Yurtdışından İthal Sıfır, Yetkili Bayiden Sıfır
- **Temizlenmiş Arayüz**: Gereksiz butonların kaldırılması
- **Gap Optimizasyonu**: İyileştirilmiş boşluk düzenlemesi

## 🛠️ Teknoloji Stack'i

### Frontend
- **React 18** + **TypeScript** - Modern, tip güvenli geliştirme
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Tutarlı icon seti
- **React Router Dom** - Client-side routing
- **React Hot Toast** - Kullanıcı bildirimleri

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - İlişkisel veritabanı
- **Row Level Security (RLS)** - Güvenlik politikaları
- **RPC Functions** - Sunucu tarafı hesaplama logikleri

### Development Tools
- **Vite** - Hızlı build tooling
- **ESLint** + **TypeScript** - Kod kalitesi ve tip kontrolü
- **Git** - Versiyon kontrolü

## 📊 Database Schema

### Ana Tablolar
```sql
motorcycles        -- Motosiklet katalog verileri
dealers           -- Bayi bilgileri  
dealer_users      -- Kullanıcı yetkilendirmeleri
price_algorithms  -- Fiyat hesaplama parametreleri
price_calculations -- Hesaplama geçmişi
```

### Güvenlik
- **RLS Policies**: Tüm tablolarda satır düzeyi güvenlik
- **Role-based Access**: Kullanıcı, admin, bayi rolleri
- **Authenticated Access**: Supabase Auth entegrasyonu

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm/yarn
- Git

### Adımlar
1. **Repository'yi klonlayın**
```bash
git clone https://github.com/umutcanbostancii/MotoValue-Update.git
cd MotoValue-Update
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment dosyasını oluşturun**
```bash
# .env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database optimizasyonunu uygulayın** (Performans için kritik)
```bash
# Supabase SQL Editor'da aşağıdaki dosyaları sırayla çalıştırın:
# 1. src/sql/3_create_indexes.sql - Temel index'ler
# 2. src/sql/4_database_optimization.sql - Gelişmiş optimizasyon
```

5. **Development server'ı başlatın**
```bash
npm run dev
```

## 📱 Kullanım

### Fiyat Hesaplama Süreci
1. **Marka Seçimi**: Sol kolondan motosiklet markasını seçin
2. **Model Seçimi**: Orta kolondan model seçin  
3. **Varyant Seçimi**: Sağ kolondan spesifik varyantı seçin (opsiyonel)
4. **Filtre Belirleme**: Yıl, kilometre ve araç durumu seçin
5. **Arama**: "Fiyat Hesapla" butonuna tıklayın
6. **Sonuçları İnceleyin**: 3 farklı fiyat karşılaştırması görün
7. **Tramer Güncellemesi**: Hasar durumunu güncelleyerek yeni fiyat alın

### Sahibinden Entegrasyonu
- **Gerçek Veriler**: JSON dosyasından yüklenen aktüel ilan verileri
- **Detaylı Görünüm**: Her ilan için "Kartı Aç" butonu
- **Dış Bağlantı**: "Git" butonu ile Sahibinden.com'a yönlendirme

## 🔧 Geliştirme Komutları

```bash
npm run dev          # Development server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build  
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript tip kontrolü
```

## 📈 Son Güncellemeler (Aralık 2024 - Ocak 2025)

### 🎯 Calculator Redesign (v2.0)
- ✅ **Dublicate KM alanı sorunu çözüldü**
- ✅ **3 kolonlu optimizasyon** (4'ten 3'e düşürüldü)
- ✅ **Türkçe araç durumu** seçenekleri eklendi
- ✅ **Collapsible Sahibinden sonuçları** (20px header)
- ✅ **Otomatik fiyat hesaplama** (tramer değişiminde)
- ✅ **Gereksiz buton temizliği** (Fiyat Hesapla dublication)

### 🚀 Performans İyileştirmeleri (v2.1)
- ✅ **State optimizasyonu** gereksiz re-render'ları önlendi
- ✅ **useReducer migration** - 15 useState → 1 useReducer
- ✅ **Error handling sistemi** - 7 error tipi, retry mechanism
- ✅ **Database optimizasyonu** - 25x hızlanma (2.5s → 0.1s)

### 📊 Database Optimization
- ✅ **7 kritik index** oluşturuldu (brand, model, composite)
- ✅ **Covering index** fiyat hesaplaması için
- ✅ **Query optimization** - sort işlemleri kaldırıldı
- ✅ **Performance monitoring** - index kullanım analytics

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Umutcan Bostancı**
- GitHub: [@umutcanbostancii](https://github.com/umutcanbostancii)
- Email: umutcanbostanci@example.com

## 🙏 Teşekkürler

- **Supabase** - Güçlü backend altyapısı için
- **React Team** - Harika geliştirme deneyimi için  
- **Tailwind CSS** - Modern ve hızlı styling için
- **Sahibinden.com** - Piyasa verileri referansı için

---

⭐ **Projeyi beğendiyseniz yıldızlamayı unutmayın!**
