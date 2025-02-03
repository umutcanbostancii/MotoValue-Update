import React from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

// Hesaplama adımlarını temsil eden veri
const steps = [
  {
    title: 'Temel Bilgiler',
    description:
      'Motosikletin markası, modeli ve üretim yılı gibi temel bilgileri girin.',
  },
  {
    title: 'Kilometre ve Durum',
    description:
      'Motosikletin kilometresi ve genel durumu fiyatı etkileyen önemli faktörlerdir.',
  },
  {
    title: 'Teknik Özellikler',
    description:
      'Motor hacmi, güç ve diğer teknik özellikler değerlemeyi etkiler.',
  },
  {
    title: 'Sonuç',
    description:
      'Tüm faktörler değerlendirilerek güncel piyasa koşullarına göre fiyat belirlenir.',
  },
];

export function Guide() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nasıl Hesaplanır?
          </h2>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-600 dark:text-gray-300">
            MotoValue, motosikletinizin değerini hesaplarken birçok faktörü göz
            önünde bulundurur. İşte değerleme sürecinin adımları:
          </p>

          <div className="mt-6 space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h3 className="font-medium text-indigo-900 dark:text-indigo-200">Önemli Not</h3>
            <p className="mt-2 text-indigo-700 dark:text-indigo-300">
              Hesaplanan değerler, güncel piyasa koşulları ve benzer
              motosikletlerin satış fiyatları baz alınarak belirlenir. Sonuçlar
              tahmini değerler olup, kesin satış fiyatını garantilemez.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}