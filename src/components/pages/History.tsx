import React from 'react';
import { History as HistoryIcon, ArrowRight } from 'lucide-react';

// Geçmiş hesaplamaları temsil eden örnek veri
const calculations = [
  {
    id: 1,
    date: '2024-03-15',
    brand: 'Honda',
    model: 'CBR 650R',
    year: 2022,
    mileage: 5000,
    estimatedPrice: '285.000 ₺',
  },
  {
    id: 2,
    date: '2024-03-14',
    brand: 'Yamaha',
    model: 'MT-07',
    year: 2021,
    mileage: 12000,
    estimatedPrice: '225.000 ₺',
  },
];

export function History() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HistoryIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Geçmiş Hesaplamalar
          </h2>
        </div>

        <div className="space-y-4">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {calc.brand} {calc.model}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {calc.year} • {calc.mileage} km
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {calc.estimatedPrice}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{calc.date}</p>
                </div>
              </div>
              <button className="mt-3 flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300">
                Tekrar Hesapla
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}