export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dealer_users: {
        Row: {
          id: string
          dealer_id: string
          firebase_uid: string
          role: 'owner' | 'employee'
          created_at: string
        }
        Insert: {
          id?: string
          dealer_id: string
          firebase_uid: string
          role: 'owner' | 'employee'
          created_at?: string
        }
        Update: {
          id?: string
          dealer_id?: string
          firebase_uid?: string
          role?: 'owner' | 'employee'
          created_at?: string
        }
      }
      motorcycles: {
        Row: {
          id: string
          brand: string
          model: string
          year: number
          engine_cc: number
          engine_power: number
          category: string
          base_price: number
          created_at: string
        }
        Insert: {
          id?: string
          brand: string
          model: string
          year: number
          engine_cc: number
          engine_power: number
          category: string
          base_price: number
          created_at?: string
        }
        Update: {
          id?: string
          brand?: string
          model?: string
          year?: number
          engine_cc?: number
          engine_power?: number
          category?: string
          base_price?: number
          created_at?: string
        }
      }
      dealers: {
        Row: {
          id: string
          name: string
          location: string
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      price_algorithms: {
        Row: {
          id: string
          dealer_id: string
          age_factor: number
          mileage_factor: number
          condition_factor: number
          market_trend_factor: number
          created_at: string
        }
        Insert: {
          id?: string
          dealer_id: string
          age_factor?: number
          mileage_factor?: number
          condition_factor?: number
          market_trend_factor?: number
          created_at?: string
        }
        Update: {
          id?: string
          dealer_id?: string
          age_factor?: number
          mileage_factor?: number
          condition_factor?: number
          market_trend_factor?: number
          created_at?: string
        }
      }
      price_calculations: {
        Row: {
          id: string
          motorcycle_id: string
          dealer_id: string
          user_id: string
          mileage: number
          condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          calculated_price: number
          created_at: string
        }
        Insert: {
          id?: string
          motorcycle_id: string
          dealer_id: string
          user_id: string
          mileage: number
          condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          calculated_price: number
          created_at?: string
        }
        Update: {
          id?: string
          motorcycle_id?: string
          dealer_id?: string
          user_id?: string
          mileage?: number
          condition?: 'new' | 'excellent' | 'good' | 'fair' | 'poor'
          calculated_price?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}