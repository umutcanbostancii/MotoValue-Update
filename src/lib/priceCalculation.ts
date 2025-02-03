import { supabase } from './supabase';
import type { 
  MotorcycleCondition, 
  TechnicalSpecs,
  SafetyFeatures,
  Accessories,
  DamageReport,
  PartCondition 
} from './types';

interface PriceFactors {
  yearEffect: number;
  mileageEffect: number;
  conditionEffect: number;
  technicalEffect: number;
  featuresEffect: number;
  damageEffect: number;
}

// Teknik özellikler etkisi hesaplama
function calculateTechnicalEffect(specs: TechnicalSpecs, baseSpecs: any): number {
  let effect = 1;

  // Araç durumu etkisi
  const conditionFactors = {
    new: 1.1,
    used: 1,
    greyImport: 0.9
  };
  effect *= conditionFactors[specs.vehicleCondition] || 1;

  // Motor gücü etkisi
  if (specs.enginePower) {
    const powerDiff = parseInt(specs.enginePower.split('-')[0]) - baseSpecs.engine_power;
    effect *= (1 + (powerDiff > 0 ? 0.05 : -0.05));
  }

  // Soğutma sistemi etkisi
  if (specs.cooling === 'liquid') {
    effect *= 1.05;
  }

  // Takas durumu etkisi
  if (specs.exchange) {
    effect *= 0.95;
  }

  return effect;
}
// Parça durumu etkisi hesaplama
function calculatePartConditionEffect(part: PartCondition): number {
  const conditionFactors = {
    original: { excellent: 1, good: 0.95, fair: 0.85, poor: 0.75 },
    modified: { excellent: 0.9, good: 0.85, fair: 0.75, poor: 0.65 },
    damaged: { excellent: 0.8, good: 0.7, fair: 0.6, poor: 0.5 },
    replaced: { excellent: 0.85, good: 0.8, fair: 0.7, poor: 0.6 }
  };

  return conditionFactors[part.condition][part.status];
}

// Hasar/Tramer etkisi hesaplama
function calculateDamageEffect(damageReport: DamageReport): number {
  const partWeights = {
    chassis: 0.2,
    engine: 0.25,
    transmission: 0.15,
    frontFork: 0.1,
    fuelTank: 0.05,
    electrical: 0.1,
    frontPanel: 0.05,
    rearPanel: 0.05,
    exhaust: 0.05
  };

  let totalEffect = 0;
  for (const [part, weight] of Object.entries(partWeights)) {
    const partEffect = calculatePartConditionEffect(damageReport[part as keyof DamageReport]);
    totalEffect += partEffect * weight;
  }

  return totalEffect;
}

// Güvenlik özellikleri etkisi hesaplama
function calculateSafetyEffect(features: SafetyFeatures): number {
  const featureWeights = {
    abs: 0.15,
    airbag: 0.15,
    alarm: 0.1,
    immobilizer: 0.1,
    tractionControl: 0.15,
    sideBars: 0.1,
    frontProtectionBar: 0.1,
    siriSupport: 0.05
  };

  let totalEffect = 1;
  for (const [feature, weight] of Object.entries(featureWeights)) {
    if (features[feature as keyof SafetyFeatures]) {
      totalEffect += weight;
    }
  }

  return totalEffect;
}

// Aksesuar etkisi hesaplama
function calculateAccessoryEffect(accessories: Accessories): number {
  const accessoryWeights = {
    heatedGrips: 0.05,
    topCase: 0.1,
    luggageSystem: 0.1,
    carbon: 0.15,
    nos: 0.05,
    ledStop: 0.05,
    xenonLight: 0.05,
    gps: 0.1,
    ledSignal: 0.05,
    soundSystem: 0.05,
    frontCamera: 0.1,
    usbPort: 0.05,
    underSeatStorage: 0.1
  };

  let totalEffect = 1;
  for (const [accessory, weight] of Object.entries(accessoryWeights)) {
    if (accessories[accessory as keyof Accessories]) {
      totalEffect += weight;
    }
  }

  return totalEffect;
}

// Ana fiyat hesaplama fonksiyonu
export async function calculatePrice(params: {
  motorcycleId: string;
  dealerId: string;
  userId: string;
  mileage: number;
  condition: MotorcycleCondition;
  technicalSpecs: TechnicalSpecs;
  safetyFeatures: SafetyFeatures;
  accessories: Accessories;
  damageReport: DamageReport;
}): Promise<{ finalPrice: number; factors: PriceFactors }> {
  try {
    // Motosiklet temel bilgilerini al
    const { data: motorcycle } = await supabase
      .from('motorcycles')
      .select('*')
      .eq('id', params.motorcycleId)
      .single();

    if (!motorcycle) {
      throw new Error('Motosiklet bulunamadı');
    }

    // Algoritma parametrelerini al
    const { data: algorithm } = await supabase
      .from('price_algorithms')
      .select('*')
      .eq('dealer_id', params.dealerId)
      .single();

    if (!algorithm) {
      throw new Error('Fiyat algoritması bulunamadı');
    }

    // Faktörleri hesapla
    const currentYear = new Date().getFullYear();
    const age = currentYear - motorcycle.year;

    const factors: PriceFactors = {
      yearEffect: Math.pow(algorithm.age_factor, age),
      mileageEffect: Math.pow(algorithm.mileage_factor, params.mileage / 10000),
      conditionEffect: {
        new: 1,
        excellent: 0.95,
        good: 0.85,
        fair: 0.75,
        poor: 0.60
      }[params.condition] * algorithm.condition_factor,
      technicalEffect: calculateTechnicalEffect(params.technicalSpecs, motorcycle),
      featuresEffect: (calculateSafetyEffect(params.safetyFeatures) + 
                      calculateAccessoryEffect(params.accessories)) / 2,
      damageEffect: calculateDamageEffect(params.damageReport)
    };

    // Toplam etkiyi hesapla
    const totalEffect = Object.values(factors).reduce((a, b) => a * b, 1);

    // Son fiyatı hesapla
    const finalPrice = Math.round(motorcycle.base_price * totalEffect * algorithm.market_trend_factor);

    // Hesaplama sonucunu kaydet
    await supabase.from('price_calculations').insert({
      motorcycle_id: params.motorcycleId,
      dealer_id: params.dealerId,
      user_id: params.userId,
      mileage: params.mileage,
      condition: params.condition,
      calculated_price: finalPrice
    });

    return { finalPrice, factors };
  } catch (error) {
    console.error('Fiyat hesaplama hatası:', error);
    throw error;
  }
}