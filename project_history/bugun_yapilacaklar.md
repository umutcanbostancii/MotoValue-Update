# Bugün Yapılacaklar

## Ana Sayfa (Landing Page) Sorunları:
- Login butonu deaktif
- Bayi girişi butonu deaktif
- "Panele Git" butonu direkt panele yönlendiriyor (auth bypass)
- Auth kontrolü yapılmıyor

## Auth Durumu:
- Firebase bağlantısı kaldırıldı
- Supabase auth entegre edildi ama route'lar güncellenmemiş
- Login/Register flow'u tamamlanmamış

## Yapılması Gerekenler:
```markdown
a) Auth Flow İyileştirmesi:
- [ ] Login sayfası aktivasyonu
- [ ] Register sayfası aktivasyonu
- [ ] Auth route guard implementasyonu
- [ ] Unauthorized erişim kontrolü
- [ ] Role-based routing yapısı

b) Navigation İyileştirmesi:
- [ ] "Panele Git" butonunun auth kontrolü
- [ ] Bayi/Admin panel erişim ayrımı
- [ ] Header'da login durumu gösterimi
- [ ] Logout fonksiyonalitesi
```

## Gösterge Paneli
- **Toplam Sorgu (1,234)**: SQL sorguları ve stored procedure'ler oluşturulacak.
- **Aktif Kullanıcılar (321)**: Kullanıcı aktiviteleri izlenecek.
- **Ortalama Fiyat (₺125,000)**: Fiyat verileri dinamik hale getirilecek.
- **Frontend İmplementasyonu**: `useMetrics` hook'u ve realtime updates eklenecek.
- **Cache Stratejisi**: Redis veya Supabase cache kullanılabilir.

## Fiyat Hesapla Ekranı
- **Form Yapısı ve Alanları**: Temel bilgiler, teknik özellikler, güvenlik ve aksesuarlar.
- **Backend ve Algoritma**: Fiyat hesaplama algoritması ve API endpoint'leri.
- **Frontend**: Form validasyonları ve state management.

## Geçmiş Ekranı
- **Veritabanı Şeması**: `price_calculations` tablosu güncellenecek.
- **Backend API**: Geçmiş işlemler için API endpoint'leri.
- **Frontend**: Filtreleme, sayfalama ve performans optimizasyonları.

## Nasıl Hesaplanır Ekranı
- **Hesaplama Adımları**: Detaylı açıklamalar ve görsel örnekler.
- **Etkileşimli Açıklamalar**: Kullanıcı bilgilendirmesi için.

## Ayarlar Ekranı
- **Profil ve Sistem Ayarları**: Kişisel bilgiler, güvenlik ve bayi ayarları.
- **Görünüm ve Bildirim Ayarları**: Tema, dil, bildirim tercihleri.
- **Güvenlik ve Hesap Ayarları**: Şifre değiştirme, oturum yönetimi.

## Admin Paneli
- **Algoritma Ayarları**: Canlı olarak değiştirilebilir algoritma ayarları.
- **Backend ve API**: `algorithm_settings` tablosu ve API endpoint'leri.
- **Frontend**: Slider ve canlı önizleme özellikleri.

## Login ve Sign Up Ekranları
- **Aktivasyon**: Login ve sign up butonları aktif hale getirilecek.
- **Entegrasyon**: Supabase ile kullanıcı doğrulama ve yetkilendirme.
- **Hata Mesajları**: Kullanıcı geri bildirimleri eklenecek. 