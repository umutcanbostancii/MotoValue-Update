import React from 'react';
import { ShieldCheck, Users, Settings as SettingsIcon, TrendingUp } from 'lucide-react';

export function Admin() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Admin Paneli</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bayi Yönetimi */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Bayi Yönetimi</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Bayileri görüntüle, düzenle ve yeni bayi ekle
            </p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              Bayileri Yönet →
            </button>
          </div>

          {/* Algoritma Ayarları */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Algoritma Ayarları</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Fiyat hesaplama parametrelerini düzenle
            </p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              Ayarları Düzenle →
            </button>
          </div>

          {/* Metrikler */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Metrikler</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Sistem performansı ve kullanım istatistikleri
            </p>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
              Metrikleri Görüntüle →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}