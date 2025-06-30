import { Calculator, Users, TrendingUp, Bike, Clock, CheckCircle2, BarChart3, Zap, Target, Activity } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Glass Panel */}
      <div className="glass-panel bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 text-white shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hoş Geldiniz!</h1>
        <p className="text-white/80 text-sm sm:text-base">
          Motosiklet değerleme platformunuza genel bakış
        </p>
      </div>

      {/* Stats Grid with Glass Effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Aylık İşlem - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Bu Ay
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">5.000+</h3>
          <p className="text-white/90 font-medium">Aylık Değerleme İşlemi</p>
          <p className="text-xs text-white/70 mt-2">
            <span className="text-green-300">↗ +12.5%</span> geçen aya göre
          </p>
        </div>

        {/* Doğruluk Oranı - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Doğruluk
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">%97</h3>
          <p className="text-white/90 font-medium">Doğruluk Oranı</p>
          <p className="text-xs text-white/70 mt-2">
            Piyasa değerleri ile uyumlu
          </p>
        </div>

        {/* Canlı Veri - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl relative">
              <Clock className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Canlı
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">24/7</h3>
          <p className="text-white/90 font-medium">Güncel Veri Analizi</p>
          <p className="text-xs text-white/70 mt-2">
            Sahibinden'den anlık veri
          </p>
        </div>

        {/* Bu Ay Değerleme - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Güncel
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">127</h3>
          <p className="text-white/90 font-medium">Bu Ay Değerleme</p>
          <p className="text-xs text-white/70 mt-2">
            <span className="text-green-300">↗ +8.1%</span> artış var
          </p>
        </div>

        {/* Kar Marjı - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Ortalama
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">%16.2</h3>
          <p className="text-white/90 font-medium">Ortalama Kar Marjı</p>
          <p className="text-xs text-white/70 mt-2">
            Optimal karlılık aralığında
          </p>
        </div>

        {/* Analiz Faktörü - Glass Card */}
        <div className="group glass-card bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              Faktör
            </span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">15+</h3>
          <p className="text-white/90 font-medium">Değerleme Faktörü</p>
          <p className="text-xs text-white/70 mt-2">
            Gelişmiş algoritma analizi
          </p>
        </div>
      </div>

      {/* System Status - Glass Panel */}
      <div className="glass-panel bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Sistem Durumu</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-300 font-medium">Tüm Sistemler Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* API Status */}
          <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">API Servisi</p>
              <p className="text-xs text-green-300">Çevrimiçi</p>
            </div>
          </div>

          {/* SignalR Status */}
          <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">SignalR Hub</p>
              <p className="text-xs text-green-300">Bağlı</p>
            </div>
          </div>

          {/* Database */}
          <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">Veritabanı</p>
              <p className="text-xs text-green-300">Sağlıklı</p>
            </div>
          </div>

          {/* Sahibinden */}
          <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-white">Sahibinden</p>
              <p className="text-xs text-green-300">Erişilebilir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access - Glass Panel */}
      <div className="glass-panel bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Hızlı Erişim</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 group">
            <Calculator className="h-8 w-8 text-blue-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-white">Fiyat Hesapla</p>
              <p className="text-xs text-white/70">Hemen değerle</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 group">
            <Activity className="h-8 w-8 text-purple-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-white">Geçmiş</p>
              <p className="text-xs text-white/70">Önceki hesaplamalar</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 group">
            <TrendingUp className="h-8 w-8 text-green-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-white">Piyasa Analizi</p>
              <p className="text-xs text-white/70">Trend görüntüle</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 group">
            <Bike className="h-8 w-8 text-orange-300 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <p className="font-medium text-white">Rehber</p>
              <p className="text-xs text-white/70">Nasıl kullanılır</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}