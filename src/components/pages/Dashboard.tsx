import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calculator as CalcIcon,
  Bike
} from 'lucide-react';

const stats = [
  {
    title: 'Toplam Sorgu',
    value: '1,234',
    icon: CalcIcon,
    trend: '+12.5%',
  },
  {
    title: 'Aktif Kullanıcılar',
    value: '321',
    icon: Users,
    trend: '+5.2%',
  },
  {
    title: 'Ortalama Fiyat',
    value: '₺125,000',
    icon: TrendingUp,
    trend: '+8.1%',
  },
];

const brands = [
  { name: 'Honda', models: 24, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=300&h=200' },
  { name: 'Yamaha', models: 18, image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=300&h=200' },
  { name: 'Ducati', models: 12, image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=300&h=200' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.trend}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400"> bu ay</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mevcut Motosiklet Verileri
          </h2>
          <div className="flex items-center space-x-2">
            <Bike className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">54 Marka</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="relative group overflow-hidden rounded-lg"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-full h-48 object-cover transform transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-semibold text-white">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-200 dark:text-gray-300">{brand.models} Model</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}