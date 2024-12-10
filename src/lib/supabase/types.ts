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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'dentist' | 'lab'
          practice_name?: string
          lab_name?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role: 'dentist' | 'lab'
          practice_name?: string
          lab_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'dentist' | 'lab'
          practice_name?: string
          lab_name?: string
          updated_at?: string
        }
      }
      cost_estimates: {
        Row: {
          id: string
          dentist_id: string
          lab_id?: string
          patient_id: string
          treatment_type: string
          description: string
          total_cost: number
          lab_fees?: number
          status: 'draft' | 'pending_lab' | 'priced' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dentist_id: string
          lab_id?: string
          patient_id: string
          treatment_type: string
          description: string
          total_cost: number
          lab_fees?: number
          status: 'draft' | 'pending_lab' | 'priced' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          dentist_id?: string
          lab_id?: string
          patient_id?: string
          treatment_type?: string
          description?: string
          total_cost?: number
          lab_fees?: number
          status?: 'draft' | 'pending_lab' | 'priced' | 'accepted' | 'rejected'
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          dentist_id: string
          lab_id: string
          patient_id: string
          treatment_type: string
          description: string
          status: string
          total_cost: number
          created_at: string
          updated_at: string
          due_date: string
        }
        Insert: {
          id?: string
          dentist_id: string
          lab_id: string
          patient_id: string
          treatment_type: string
          description: string
          status: string
          total_cost: number
          created_at?: string
          updated_at?: string
          due_date: string
        }
        Update: {
          dentist_id?: string
          lab_id?: string
          patient_id?: string
          treatment_type?: string
          description?: string
          status?: string
          total_cost?: number
          updated_at?: string
          due_date?: string
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