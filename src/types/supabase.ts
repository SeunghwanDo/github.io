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
      skill_courses: {
        Row: {
          id: string
          title: string
          provider_name: string
          category: string | null
          duration: string | null
          cost: string | null
          location: string | null
          start_date: string | null
          status: string | null
          thumbnail_url: string | null
          description: string | null
          rating: number | null
          students: number | null
          capacity: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          provider_name: string
          category?: string | null
          duration?: string | null
          cost?: string | null
          location?: string | null
          start_date?: string | null
          status?: string | null
          thumbnail_url?: string | null
          description?: string | null
          rating?: number | null
          students?: number | null
          capacity?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          provider_name?: string
          category?: string | null
          duration?: string | null
          cost?: string | null
          location?: string | null
          start_date?: string | null
          status?: string | null
          thumbnail_url?: string | null
          description?: string | null
          rating?: number | null
          students?: number | null
          capacity?: number | null
          created_at?: string
        }
      }
      skill_assessments: {
        Row: {
          id: string
          user_id: string | null
          company_id: string | null
          scores: Json
          average_score: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          company_id?: string | null
          scores: Json
          average_score: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          company_id?: string | null
          scores?: Json
          average_score?: number
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          company_id: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          company_id?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          company_id?: string | null
          role?: string | null
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          industry: string | null
          employee_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          industry?: string | null
          employee_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          industry?: string | null
          employee_count?: number | null
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

// Convenience types
export type SkillCourse = Database['public']['Tables']['skill_courses']['Row']
export type SkillAssessment = Database['public']['Tables']['skill_assessments']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
