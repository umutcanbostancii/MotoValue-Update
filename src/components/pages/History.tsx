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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HistoryIcon className="h-6 w-6 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">
            Geçmiş Hesaplamalar
          </h2>
        </div>

        <div className="space-y-4">
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 hover:bg-white/12 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">
                    {calc.brand} {calc.model}
                  </h3>
                  <p className="text-sm text-white/70">
                    {calc.year} • {calc.mileage} km
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {calc.estimatedPrice}
                  </p>
                  <p className="text-sm text-white/70">{calc.date}</p>
                </div>
              </div>
              <button className="mt-3 flex items-center text-sm text-blue-300 hover:text-blue-200 transition-colors">
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