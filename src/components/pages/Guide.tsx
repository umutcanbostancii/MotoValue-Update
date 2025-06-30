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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="h-6 w-6 text-blue-300" />
          <h2 className="text-xl font-semibold text-white">
            Nasıl Hesaplanır?
          </h2>
        </div>

        <div className="prose max-w-none">
          <p className="text-white/80">
            MotorDegerle, motosikletinizin değerini hesaplarken birçok faktörü göz
            önünde bulundurur. İşte değerleme sürecinin adımları:
          </p>

          <div className="mt-6 space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-white/8 backdrop-blur-2xl border border-white/15 rounded-3xl hover:bg-white/12 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{step.title}</h3>
                  <p className="mt-1 text-white/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-2xl rounded-3xl border border-blue-300/30 shadow-lg">
            <h3 className="font-medium text-blue-200">Önemli Not</h3>
            <p className="mt-2 text-blue-100">
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