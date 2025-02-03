// Motosiklet durumu için tip tanımı
export type MotorcycleCondition = 'new' | 'excellent' | 'good' | 'fair' | 'poor';

// Teknik özellikler için tip tanımları
export interface TechnicalSpecs {
  engineType: string;
  enginePower: string;
  engineCapacity: string; // Motor hacmi (cc)
  transmission: string;
  cylinderCount: string;
  cooling: string;
  color: string;
  origin: string;
  vehicleCondition: 'new' | 'used' | 'greyImport';
  timingType: string;
  exchange: boolean;
}

// Parça durumu için tip tanımı
export interface PartCondition {
  name: string;
  condition: 'original' | 'modified' | 'damaged' | 'replaced';
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

// Güvenlik özellikleri için tip tanımı
export interface SafetyFeatures {
  abs: boolean;
  airbag: boolean;
  alarm: boolean;
  immobilizer: boolean;
  tractionControl: boolean;
  sideBars: boolean;
  frontProtectionBar: boolean;
  siriSupport: boolean;
}

// Aksesuar özellikleri için tip tanımı
export interface Accessories {
  heatedGrips: boolean;
  topCase: boolean;
  luggageSystem: boolean;
  carbon: boolean;
  nos: boolean;
  ledStop: boolean;
  xenonLight: boolean;
  gps: boolean;
  ledSignal: boolean;
  soundSystem: boolean;
  frontCamera: boolean;
  usbPort: boolean;
  underSeatStorage: boolean;
}

// Hasar/Tramer durumu için tip tanımı
export interface DamageReport {
  chassis: PartCondition;
  engine: PartCondition;
  transmission: PartCondition;
  frontFork: PartCondition;
  fuelTank: PartCondition;
  electrical: PartCondition;
  frontPanel: PartCondition;
  rearPanel: PartCondition;
  exhaust: PartCondition;
}