// =====================================================
// Database Types for Procurement Chain Data Analyzer
// =====================================================
// Auto-generated types matching the Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: {
          id: string
          type: 'info' | 'warning' | 'error' | 'success'
          title: string
          message: string
          is_read: boolean
          user_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'info' | 'warning' | 'error' | 'success'
          title: string
          message: string
          is_read?: boolean
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          title?: string
          message?: string
          is_read?: boolean
          user_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      exchange_rates: {
        Row: {
          id: string
          currency_code: string
          year: number
          rate_to_irr: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          currency_code: string
          year: number
          rate_to_irr: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          currency_code?: string
          year?: number
          rate_to_irr?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ingestion_job_details: {
        Row: {
          id: string
          job_id: string
          row_number: number
          status: string
          error_message: string | null
          raw_data: Json | null
          processed_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          row_number: number
          status: string
          error_message?: string | null
          raw_data?: Json | null
          processed_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          row_number?: number
          status?: string
          error_message?: string | null
          raw_data?: Json | null
          processed_data?: Json | null
          created_at?: string
        }
      }
      ingestion_jobs: {
        Row: {
          id: string
          filename: string
          file_type: string
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_rows: number
          success_rows: number
          failed_rows: number
          error_details: Json | null
          started_at: string | null
          completed_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          filename: string
          file_type: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_rows?: number
          success_rows?: number
          failed_rows?: number
          error_details?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          filename?: string
          file_type?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          total_rows?: number
          success_rows?: number
          failed_rows?: number
          error_details?: Json | null
          started_at?: string | null
          completed_at?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      procurement_requests: {
        Row: {
          id: string
          request_number: string
          requester_id: string | null
          requester_name: string
          department: string | null
          purchase_circle_id: string | null
          purchase_circle_name: string
          status: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged'
          request_date: string
          order_amount: number
          currency_code: string
          order_amount_irr: number | null
          mrs_date: string | null
          entered_purchase_circle_date: string | null
          sourcing_start_date: string | null
          evaluation_start_date: string | null
          order_placement_date: string | null
          completion_date: string | null
          estimated_eta: string | null
          days_to_mrs: number | null
          days_in_sourcing: number | null
          days_in_evaluation: number | null
          total_duration_days: number | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          request_number: string
          requester_id?: string | null
          requester_name: string
          department?: string | null
          purchase_circle_id?: string | null
          purchase_circle_name: string
          status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged'
          request_date: string
          order_amount: number
          currency_code?: string
          order_amount_irr?: number | null
          mrs_date?: string | null
          entered_purchase_circle_date?: string | null
          sourcing_start_date?: string | null
          evaluation_start_date?: string | null
          order_placement_date?: string | null
          completion_date?: string | null
          estimated_eta?: string | null
          days_to_mrs?: number | null
          days_in_sourcing?: number | null
          days_in_evaluation?: number | null
          total_duration_days?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          request_number?: string
          requester_id?: string | null
          requester_name?: string
          department?: string | null
          purchase_circle_id?: string | null
          purchase_circle_name?: string
          status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged'
          request_date?: string
          order_amount?: number
          currency_code?: string
          order_amount_irr?: number | null
          mrs_date?: string | null
          entered_purchase_circle_date?: string | null
          sourcing_start_date?: string | null
          evaluation_start_date?: string | null
          order_placement_date?: string | null
          completion_date?: string | null
          estimated_eta?: string | null
          days_to_mrs?: number | null
          days_in_sourcing?: number | null
          days_in_evaluation?: number | null
          total_duration_days?: number | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      purchase_circles: {
        Row: {
          id: string
          name: string
          name_persian: string
          type: 'بسپاران' | 'صنعتی' | 'خدماتی' | 'عمومی'
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_persian: string
          type: 'بسپاران' | 'صنعتی' | 'خدماتی' | 'عمومی'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_persian?: string
          type?: 'بسپاران' | 'صنعتی' | 'خدماتی' | 'عمومی'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      request_items: {
        Row: {
          id: string
          request_id: string
          item_name: string
          item_description: string | null
          quantity: number | null
          unit_price: number | null
          total_price: number | null
          currency_code: string
          total_price_irr: number | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          item_name: string
          item_description?: string | null
          quantity?: number | null
          unit_price?: number | null
          total_price?: number | null
          currency_code?: string
          total_price_irr?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          item_name?: string
          item_description?: string | null
          quantity?: number | null
          unit_price?: number | null
          total_price?: number | null
          currency_code?: string
          total_price_irr?: number | null
          created_at?: string
        }
      }
      request_timeline: {
        Row: {
          id: string
          request_id: string
          stage: string
          previous_status: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          new_status: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          stage_date: string | null
          duration_days: number | null
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          stage: string
          previous_status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          new_status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          stage_date?: string | null
          duration_days?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          stage?: string
          previous_status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          new_status?: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged' | null
          stage_date?: string | null
          duration_days?: number | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'manager' | 'analyst' | 'buyer' | 'auditor'
          department: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'admin' | 'manager' | 'analyst' | 'buyer' | 'auditor'
          department?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'manager' | 'analyst' | 'buyer' | 'auditor'
          department?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      kpi_summary: {
        Row: {
          total_requests: number | null
          active_requests: number | null
          completed_requests: number | null
          flagged_requests: number | null
          total_cost_irr: number | null
          avg_days_to_mrs: number | null
          avg_total_duration: number | null
        }
      }
      monthly_request_trends: {
        Row: {
          month: string | null
          request_count: number | null
          total_cost_irr: number | null
          avg_duration: number | null
        }
      }
      purchase_circle_performance: {
        Row: {
          circle_name: string | null
          circle_name_persian: string | null
          total_requests: number | null
          avg_duration: number | null
          total_cost_irr: number | null
          completed_count: number | null
          completion_rate: number | null
        }
      }
    }
    Functions: {
      calculate_eta: {
        Args: {
          p_request_id: string
        }
        Returns: string
      }
      calculate_irr_amount: {
        Args: {
          amount: number
          currency: string
          request_date: string
        }
        Returns: number
      }
    }
    Enums: {
      alert_type: 'info' | 'warning' | 'error' | 'success'
      ingestion_status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
      purchase_circle: 'بسپاران' | 'صنعتی' | 'خدماتی' | 'عمومی'
      request_status: 'draft' | 'submitted' | 'in_progress' | 'mrs_issued' | 'sourcing' | 'evaluation' | 'order_placed' | 'completed' | 'cancelled' | 'flagged'
      user_role: 'admin' | 'manager' | 'analyst' | 'buyer' | 'auditor'
    }
  }
}

// =====================================================
// Convenience Types
// =====================================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Specific table types
export type User = Tables<'users'>
export type ProcurementRequest = Tables<'procurement_requests'>
export type RequestItem = Tables<'request_items'>
export type ExchangeRate = Tables<'exchange_rates'>
export type PurchaseCircle = Tables<'purchase_circles'>
export type IngestionJob = Tables<'ingestion_jobs'>
export type Alert = Tables<'alerts'>
export type RequestTimeline = Tables<'request_timeline'>
export type SystemSetting = Tables<'system_settings'>

// View types
export type KPISummary = Database['public']['Views']['kpi_summary']['Row']
export type MonthlyRequestTrend = Database['public']['Views']['monthly_request_trends']['Row']
export type PurchaseCirclePerformance = Database['public']['Views']['purchase_circle_performance']['Row']

// Enum types
export type UserRole = Enums<'user_role'>
export type RequestStatus = Enums<'request_status'>
export type AlertType = Enums<'alert_type'>
export type IngestionStatus = Enums<'ingestion_status'>
export type PurchaseCircleType = Enums<'purchase_circle'>

// =====================================================
// Extended Types with Relations
// =====================================================

export interface ProcurementRequestWithDetails extends ProcurementRequest {
  purchase_circles?: PurchaseCircle
  users?: User
  request_items?: RequestItem[]
  request_timeline?: RequestTimeline[]
}

export interface UserWithRole extends User {
  role: UserRole
}

export interface IngestionJobWithDetails extends IngestionJob {
  ingestion_job_details?: Tables<'ingestion_job_details'>[]
  users?: User
}

// =====================================================
// API Response Types
// =====================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// =====================================================
// Form Types
// =====================================================

export interface CreateRequestForm {
  request_number: string
  requester_name: string
  department?: string
  purchase_circle_id: string
  request_date: string
  order_amount: number
  currency_code: string
  items?: {
    item_name: string
    item_description?: string
    quantity?: number
    unit_price?: number
  }[]
}

export interface UpdateRequestForm {
  status?: RequestStatus
  mrs_date?: string
  entered_purchase_circle_date?: string
  sourcing_start_date?: string
  evaluation_start_date?: string
  order_placement_date?: string
  completion_date?: string
  notes?: string
}

export interface CreateExchangeRateForm {
  currency_code: string
  year: number
  rate_to_irr: number
}

export interface CreateUserForm {
  email: string
  full_name: string
  role: UserRole
  department?: string
}

// =====================================================
// Filter and Search Types
// =====================================================

export interface RequestFilters {
  status?: RequestStatus[]
  purchase_circle_id?: string[]
  requester_id?: string[]
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
  currency_code?: string[]
}

export interface RequestSearchParams {
  query?: string
  filters?: RequestFilters
  sort_by?: 'request_date' | 'order_amount' | 'status' | 'estimated_eta'
  sort_order?: 'asc' | 'desc'
  page?: number
  page_size?: number
}
