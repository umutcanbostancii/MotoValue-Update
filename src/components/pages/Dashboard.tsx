import { Calculator, Users, TrendingUp, Bike } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Sorgu</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">+12.5% bu ay</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Kullanıcılar</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">321</h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">+5.2% bu ay</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Fiyat</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₺125,000</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">+8.1% bu ay</p>
        </div>
      </div>

      {/* Mevcut Motosiklet Verileri */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Mevcut Motosiklet Verileri</h2>
          <div className="flex items-center space-x-2">
            <Bike className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">54 Marka</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"
              alt="Honda"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white text-lg font-semibold">Honda</h3>
              <p className="text-gray-200 text-sm">24 Model</p>
            </div>
          </div>

          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39"
              alt="Yamaha"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white text-lg font-semibold">Yamaha</h3>
              <p className="text-gray-200 text-sm">18 Model</p>
            </div>
          </div>

          <div className="relative group">
            <img
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87"
              alt="Ducati"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-white text-lg font-semibold">Ducati</h3>
              <p className="text-gray-200 text-sm">12 Model</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}