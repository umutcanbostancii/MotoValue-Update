import { ShieldCheck, Users, Settings as SettingsIcon, TrendingUp } from 'lucide-react';

export function Admin() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="h-6 w-6 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">Admin Paneli</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bayi Yönetimi */}
          <div className="p-4 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl hover:bg-white/12 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-5 w-5 text-blue-300" />
              <h3 className="font-medium text-white">Bayi Yönetimi</h3>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Bayileri görüntüle, düzenle ve yeni bayi ekle
            </p>
            <button className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors">
              Bayileri Yönet →
            </button>
          </div>

          {/* Algoritma Ayarları */}
          <div className="p-4 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl hover:bg-white/12 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="h-5 w-5 text-blue-300" />
              <h3 className="font-medium text-white">Algoritma Ayarları</h3>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Fiyat hesaplama parametrelerini düzenle
            </p>
            <button className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors">
              Ayarları Düzenle →
            </button>
          </div>

          {/* Metrikler */}
          <div className="p-4 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl hover:bg-white/12 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-300" />
              <h3 className="font-medium text-white">Metrikler</h3>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Sistem performansı ve kullanım istatistikleri
            </p>
            <button className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors">
              Metrikleri Görüntüle →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}