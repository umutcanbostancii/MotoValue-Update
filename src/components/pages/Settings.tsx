import { Settings as SettingsIcon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="h-6 w-6 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">Ayarlar</h2>
        </div>

        <div className="space-y-6">
          {/* Tema Ayarları */}
          <div className="border-b border-white/15 pb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Görünüm Ayarları
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sun className="h-5 w-5 text-white/70" />
                <span className="text-white/80">Tema</span>
              </div>
              <select
                className="bg-white/8 backdrop-blur-2xl border border-white/15 text-white rounded-3xl px-4 py-2 focus:border-blue-400 focus:outline-none"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              >
                <option value="light" className="bg-gray-800 text-white">Açık Tema</option>
                <option value="dark" className="bg-gray-800 text-white">Koyu Tema</option>
                <option value="system" className="bg-gray-800 text-white">Sistem Teması</option>
              </select>
            </div>
          </div>

          {/* Bildirim Ayarları */}
          <div className="border-b border-white/15 pb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Bildirim Ayarları
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-white/70" />
                  <span className="text-white/80">Fiyat Değişim Bildirimleri</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-white/70" />
                  <span className="text-white/80">Piyasa Trend Bildirimleri</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/30 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Hesap Ayarları */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Hesap Ayarları
            </h3>
            <button className="text-red-400 hover:text-red-300 font-medium transition-colors">
              Hesabı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}