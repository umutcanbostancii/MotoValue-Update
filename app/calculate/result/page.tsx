'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowDownIcon, ShareIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface CalculationResult {
  brand: string;
  model: string;
  category: string;
  engine_cc: number;
  original_price: number;
  calculated_price: number;
  category_factor: number;
  cc_factor: number;
  age_factor: number;
  price_increase_percentage: number;
}

export default function CalculationResultPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const motorcycleId = searchParams.get('id');

  useEffect(() => {
    async function fetchResult() {
      if (!motorcycleId) return;
      
      const { data, error } = await supabase
        .rpc('calculate_motorcycle_price', {
          motorcycle_id: motorcycleId
        });

      if (data && data[0]?.calculate_motorcycle_price) {
        setResult(data[0].calculate_motorcycle_price);
      }
      setLoading(false);
    }

    fetchResult();
  }, [motorcycleId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Değerleme Sonucu
          </h1>
          <p className="text-gray-400">
            {result.brand} {result.model}
          </p>
        </div>

        {/* Ana Sonuç Kartı */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-gray-400 mb-2">Mevcut Değer</div>
              <div className="text-3xl font-bold text-white">
                {new Intl.NumberFormat('tr-TR').format(result.original_price)} TL
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-2">Hesaplanan Değer</div>
              <div className="text-3xl font-bold text-green-400">
                {new Intl.NumberFormat('tr-TR').format(result.calculated_price)} TL
                <span className="text-lg ml-2 font-normal">
                  ({result.price_increase_percentage > 0 ? '+' : ''}{result.price_increase_percentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Faktör Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
            <div className="text-gray-400 mb-2">Kategori Faktörü</div>
            <div className="text-2xl text-white">{result.category_factor}x</div>
            <div className="text-sm text-gray-500 mt-2">{result.category}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
            <div className="text-gray-400 mb-2">Motor Hacmi Faktörü</div>
            <div className="text-2xl text-white">{result.cc_factor}x</div>
            <div className="text-sm text-gray-500 mt-2">{result.engine_cc} cc</div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
            <div className="text-gray-400 mb-2">Yaş Faktörü</div>
            <div className="text-2xl text-white">{result.age_factor}x</div>
            <div className="text-sm text-gray-500 mt-2">Model yılı etkisi</div>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all">
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
