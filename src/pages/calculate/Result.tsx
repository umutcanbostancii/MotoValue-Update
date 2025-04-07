import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { ArrowDownIcon, ShareIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Supabase client initialization
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Mevcut' : 'Eksik');

interface PriceAdjustment {
  name: string;
  description: string;
  factor: number;
  effect: string;
  amount: number;
}

interface CalculationResult {
  motorcycle_details: {
    brand: string;
    model: string;
    year: number;
    category: string;
    engine_cc: number;
  };
  base_price: number;
  price_adjustments: PriceAdjustment[];
  calculated_price: number;
}

export default function CalculationResultPage() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const motorcycleId = searchParams.get('id');
  const mileage = searchParams.get('mileage') || '0';
  const condition = searchParams.get('condition') || 'good';
  const damageStatus = searchParams.get('damageStatus') || '{}';
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function fetchResult() {
      if (!motorcycleId) {
        setError('Motosiklet ID\'si bulunamadı');
        setLoading(false);
        return;
      }
      
      try {
        const { data, error: supabaseError } = await supabase
          .rpc('calculate_motorcycle_price', {
            input_motorcycle_id: motorcycleId,
            input_mileage: parseInt(mileage, 10),
            input_condition: condition,
            input_damage_status: JSON.parse(damageStatus)
          });

        if (supabaseError) {
          throw supabaseError;
        }

        if (data) {
          setResult(data);
        } else {
          setError('Hesaplama sonucu bulunamadı');
        }
      } catch (err) {
        console.error('Hesaplama hatası:', err);
        setError('Hesaplama sırasında bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [motorcycleId, mileage, condition, damageStatus, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl bg-red-500/10 p-6 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Sonuç bulunamadı</div>
      </div>
    );
  }

  // TL formatı için
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // PDF raporu oluşturma fonksiyonu
  const generatePDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    
    // Doküman başlığı
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MotoValue Değerleme Raporu", 105, 20, { align: "center" });
    
    // Tarih
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString('tr-TR');
    doc.text(`Oluşturulma Tarihi: ${today}`, 105, 30, { align: "center" });
    
    // Motosiklet bilgileri
    doc.setFontSize(14);
    doc.text("Motosiklet Özellikleri", 14, 45);
    doc.line(14, 47, 196, 47);
    
    const motoBilgileri = [
      ["Marka", result.motorcycle_details.brand],
      ["Model", result.motorcycle_details.model],
      ["Yıl", result.motorcycle_details.year.toString()],
      ["Kategori", result.motorcycle_details.category],
      ["Motor Hacmi", `${result.motorcycle_details.engine_cc} cc`],
      ["Kilometre", `${mileage} km`],
      ["Durum", condition]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [['Özellik', 'Değer']],
      body: motoBilgileri,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Baz Fiyat
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Baz Fiyat", 14, finalY);
    doc.line(14, finalY + 2, 196, finalY + 2);
    
    doc.setFontSize(12);
    doc.text(`Sıfır km, orijinal durumda motosiklet değeri: ${formatPrice(result.base_price)}`, 14, finalY + 10);
    
    // Fiyat faktörleri
    doc.setFontSize(14);
    doc.text("Fiyat Faktörleri", 14, finalY + 25);
    doc.line(14, finalY + 27, 196, finalY + 27);
    
    const faktörler = result.price_adjustments.map(adj => {
      return [
        adj.name,
        adj.description,
        adj.effect,
        adj.amount >= 0 ? `+${formatPrice(adj.amount)}` : formatPrice(adj.amount)
      ];
    });
    
    autoTable(doc, {
      startY: finalY + 30,
      head: [['Faktör', 'Açıklama', 'Etki', 'Tutar']],
      body: faktörler,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Nihai fiyat
    const finalY2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Nihai Değerleme Sonucu:", 14, finalY2);
    doc.setFontSize(20);
    doc.setTextColor(46, 204, 113);
    doc.text(formatPrice(result.calculated_price), 14, finalY2 + 10);
    
    // Footer
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Bu rapor MotoValue tarafından otomatik olarak oluşturulmuştur.", 105, 280, { align: "center" });
    doc.text("© 2024 MotoValue - Tüm Hakları Saklıdır", 105, 285, { align: "center" });
    
    // PDF'i kaydet
    doc.save(`MotoValue_${result.motorcycle_details.brand}_${result.motorcycle_details.model}_${today}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hesaplama Sonucu
          </h1>
          <p className="text-2xl text-green-400 font-bold">
            {formatPrice(result.calculated_price)}
          </p>
        </div>

        {/* Motosiklet Özeti */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Motosiklet Özellikleri
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Marka</div>
              <div className="text-white">{result.motorcycle_details.brand}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Model</div>
              <div className="text-white">{result.motorcycle_details.model}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Yıl</div>
              <div className="text-white">{result.motorcycle_details.year}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Kategori</div>
              <div className="text-white">{result.motorcycle_details.category}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Motor Hacmi</div>
              <div className="text-white">{result.motorcycle_details.engine_cc} cc</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Kilometre</div>
              <div className="text-white">{mileage} km</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Durum</div>
              <div className="text-white">{condition}</div>
            </div>
          </div>
        </div>

        {/* Baz Fiyat */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Baz Fiyat
          </h2>
          <div className="text-2xl font-bold text-white">
            {formatPrice(result.base_price)}
          </div>
          <div className="text-gray-400 mt-1 text-sm">
            Sıfır km, orijinal durumda motosiklet değeri
          </div>
        </div>

        {/* Fiyat Faktörleri */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Fiyat Faktörleri
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="py-2">Faktör</th>
                  <th className="py-2">Açıklama</th>
                  <th className="py-2 text-right">Etki</th>
                  <th className="py-2 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {result.price_adjustments.map((adjustment, index) => (
                  <tr key={index} className="border-t border-gray-800">
                    <td className="py-3 font-medium text-white">{adjustment.name}</td>
                    <td className="py-3 text-gray-300">{adjustment.description}</td>
                    <td className={`py-3 text-right ${adjustment.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {adjustment.effect}
                    </td>
                    <td className={`py-3 text-right ${adjustment.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {adjustment.amount >= 0 ? '+' : ''}{formatPrice(adjustment.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-700">
                  <td className="py-3 font-bold text-white" colSpan={3}>Nihai Fiyat</td>
                  <td className="py-3 text-right font-bold text-green-400">
                    {formatPrice(result.calculated_price)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={generatePDF} 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            PDF Raporu İndir
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all">
            <ShareIcon className="h-5 w-5" />
            Paylaş
          </button>
        </div>
      </div>
    </div>
  );
} 