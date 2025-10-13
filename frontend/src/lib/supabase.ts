// // =====================================================
// // Supabase Client Configuration
// // =====================================================

// import { createClient } from '@supabase/supabase-js'
// import type { Database } from '@/types/database'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables')
// }

// // Create Supabase client with TypeScript support
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: true
//   }
// })

// // =====================================================
// // Authentication Helpers
// // =====================================================

// export const auth = {
//   // Sign up new user
//   async signUp(email: string, password: string, userData: {
//     full_name: string
//     role: Database['public']['Enums']['user_role']
//     department?: string
//   }) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: userData
//       }
//     })

//     if (error) throw error

//     // Create user profile
//     if (data.user) {
//       const { error: profileError } = await supabase
//         .from('users')
//         .insert({
//           id: data.user.id,
//           email: data.user.email!,
//           full_name: userData.full_name,
//           role: userData.role,
//           department: userData.department
//         })

//       if (profileError) throw profileError
//     }

//     return data
//   },

//   // Sign in
//   async signIn(email: string, password: string) {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     })

//     if (error) throw error
//     return data
//   },

//   // Sign out
//   async signOut() {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   },

//   // Get current user
//   async getCurrentUser() {
//     const { data: { user } } = await supabase.auth.getUser()
//     return user
//   },

//   // Get current user profile
//   async getCurrentUserProfile() {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) return null

//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', user.id)
//       .single()

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // Procurement Requests API
// // =====================================================

// export const requests = {
//   // Get all requests with filters
//   async getAll(filters?: {
//     status?: string[]
//     purchase_circle_id?: string[]
//     requester_id?: string[]
//     date_from?: string
//     date_to?: string
//     search?: string
//     page?: number
//     page_size?: number
//   }) {
//     let query = supabase
//       .from('procurement_requests')
//       .select(`
//         *,
//         purchase_circles(name, name_persian),
//         users(full_name, department),
//         request_items(*)
//       `)

//     // Apply filters
//     if (filters?.status?.length) {
//       query = query.in('status', filters.status)
//     }
//     if (filters?.purchase_circle_id?.length) {
//       query = query.in('purchase_circle_id', filters.purchase_circle_id)
//     }
//     if (filters?.requester_id?.length) {
//       query = query.in('requester_id', filters.requester_id)
//     }
//     if (filters?.date_from) {
//       query = query.gte('request_date', filters.date_from)
//     }
//     if (filters?.date_to) {
//       query = query.lte('request_date', filters.date_to)
//     }
//     if (filters?.search) {
//       query = query.or(`request_number.ilike.%${filters.search}%,requester_name.ilike.%${filters.search}%`)
//     }

//     // Apply pagination
//     if (filters?.page && filters?.page_size) {
//       const from = (filters.page - 1) * filters.page_size
//       const to = from + filters.page_size - 1
//       query = query.range(from, to)
//     }

//     query = query.order('request_date', { ascending: false })

//     const { data, error, count } = await query
//     if (error) throw error

//     return { data, count }
//   },

//   // Get single request by ID
//   async getById(id: string) {
//     const { data, error } = await supabase
//       .from('procurement_requests')
//       .select(`
//         *,
//         purchase_circles(*),
//         users(full_name, department),
//         request_items(*),
//         request_timeline(*)
//       `)
//       .eq('id', id)
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Create new request
//   async create(requestData: Database['public']['Tables']['procurement_requests']['Insert']) {
//     const { data, error } = await supabase
//       .from('procurement_requests')
//       .insert(requestData)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Update request
//   async update(id: string, updates: Database['public']['Tables']['procurement_requests']['Update']) {
//     const { data, error } = await supabase
//       .from('procurement_requests')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Delete request
//   async delete(id: string) {
//     const { error } = await supabase
//       .from('procurement_requests')
//       .delete()
//       .eq('id', id)

//     if (error) throw error
//   }
// }

// // =====================================================
// // Exchange Rates API
// // =====================================================

// export const exchangeRates = {
//   // Get all exchange rates
//   async getAll() {
//     const { data, error } = await supabase
//       .from('exchange_rates')
//       .select('*')
//       .order('currency_code')
//       .order('year', { ascending: false })

//     if (error) throw error
//     return data
//   },

//   // Get rates by currency
//   async getByCurrency(currency: string) {
//     const { data, error } = await supabase
//       .from('exchange_rates')
//       .select('*')
//       .eq('currency_code', currency)
//       .order('year', { ascending: false })

//     if (error) throw error
//     return data
//   },

//   // Create new exchange rate
//   async create(rateData: Database['public']['Tables']['exchange_rates']['Insert']) {
//     const { data, error } = await supabase
//       .from('exchange_rates')
//       .insert(rateData)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Update exchange rate
//   async update(id: string, updates: Database['public']['Tables']['exchange_rates']['Update']) {
//     const { data, error } = await supabase
//       .from('exchange_rates')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Delete exchange rate
//   async delete(id: string) {
//     const { error } = await supabase
//       .from('exchange_rates')
//       .delete()
//       .eq('id', id)

//     if (error) throw error
//   }
// }

// // =====================================================
// // Purchase Circles API
// // =====================================================

// export const purchaseCircles = {
//   // Get all purchase circles
//   async getAll() {
//     const { data, error } = await supabase
//       .from('purchase_circles')
//       .select('*')
//       .eq('is_active', true)
//       .order('name')

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // Ingestion Jobs API
// // =====================================================

// export const ingestionJobs = {
//   // Get all ingestion jobs
//   async getAll() {
//     const { data, error } = await supabase
//       .from('ingestion_jobs')
//       .select(`
//         *,
//         users(full_name)
//       `)
//       .order('created_at', { ascending: false })

//     if (error) throw error
//     return data
//   },

//   // Get job by ID
//   async getById(id: string) {
//     const { data, error } = await supabase
//       .from('ingestion_jobs')
//       .select(`
//         *,
//         users(full_name),
//         ingestion_job_details(*)
//       `)
//       .eq('id', id)
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Create new ingestion job
//   async create(jobData: Database['public']['Tables']['ingestion_jobs']['Insert']) {
//     const { data, error } = await supabase
//       .from('ingestion_jobs')
//       .insert(jobData)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Update job status
//   async updateStatus(id: string, status: Database['public']['Enums']['ingestion_status'], details?: {
//     total_rows?: number
//     success_rows?: number
//     failed_rows?: number
//     error_details?: any
//     completed_at?: string
//   }) {
//     const updates: Database['public']['Tables']['ingestion_jobs']['Update'] = {
//       status,
//       ...details
//     }

//     const { data, error } = await supabase
//       .from('ingestion_jobs')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // Analytics API
// // =====================================================

// export const analytics = {
//   // Get KPI summary
//   async getKPISummary() {
//     const { data, error } = await supabase
//       .from('kpi_summary')
//       .select('*')
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Get monthly trends
//   async getMonthlyTrends() {
//     const { data, error } = await supabase
//       .from('monthly_request_trends')
//       .select('*')
//       .order('month')

//     if (error) throw error
//     return data
//   },

//   // Get purchase circle performance
//   async getPurchaseCirclePerformance() {
//     const { data, error } = await supabase
//       .from('purchase_circle_performance')
//       .select('*')
//       .order('total_requests', { ascending: false })

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // Alerts API
// // =====================================================

// export const alerts = {
//   // Get user alerts
//   async getUserAlerts() {
//     const { data, error } = await supabase
//       .from('alerts')
//       .select('*')
//       .or('user_id.is.null,user_id.eq.' + (await supabase.auth.getUser()).data.user?.id)
//       .order('created_at', { ascending: false })

//     if (error) throw error
//     return data
//   },

//   // Mark alert as read
//   async markAsRead(id: string) {
//     const { data, error } = await supabase
//       .from('alerts')
//       .update({ is_read: true })
//       .eq('id', id)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Create alert
//   async create(alertData: Database['public']['Tables']['alerts']['Insert']) {
//     const { data, error } = await supabase
//       .from('alerts')
//       .insert(alertData)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // System Settings API
// // =====================================================

// export const settings = {
//   // Get all settings
//   async getAll() {
//     const { data, error } = await supabase
//       .from('system_settings')
//       .select('*')
//       .order('key')

//     if (error) throw error
//     return data
//   },

//   // Get setting by key
//   async getByKey(key: string) {
//     const { data, error } = await supabase
//       .from('system_settings')
//       .select('*')
//       .eq('key', key)
//       .single()

//     if (error) throw error
//     return data
//   },

//   // Update setting
//   async update(key: string, value: any) {
//     const { data, error } = await supabase
//       .from('system_settings')
//       .update({ value })
//       .eq('key', key)
//       .select()
//       .single()

//     if (error) throw error
//     return data
//   }
// }

// // =====================================================
// // File Upload API
// // =====================================================

// export const storage = {
//   // Upload file
//   async uploadFile(bucket: string, path: string, file: File) {
//     const { data, error } = await supabase.storage
//       .from(bucket)
//       .upload(path, file)

//     if (error) throw error
//     return data
//   },

//   // Get file URL
//   getFileUrl(bucket: string, path: string) {
//     const { data } = supabase.storage
//       .from(bucket)
//       .getPublicUrl(path)

//     return data.publicUrl
//   },

//   // Delete file
//   async deleteFile(bucket: string, path: string) {
//     const { error } = await supabase.storage
//       .from(bucket)
//       .remove([path])

//     if (error) throw error
//   }
// }

// // =====================================================
// // Real-time Subscriptions
// // =====================================================

// export const subscriptions = {
//   // Subscribe to request updates
//   subscribeToRequests(callback: (payload: any) => void) {
//     return supabase
//       .channel('procurement_requests')
//       .on('postgres_changes', 
//         { event: '*', schema: 'public', table: 'procurement_requests' },
//         callback
//       )
//       .subscribe()
//   },

//   // Subscribe to alerts
//   subscribeToAlerts(callback: (payload: any) => void) {
//     return supabase
//       .channel('alerts')
//       .on('postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'alerts' },
//         callback
//       )
//       .subscribe()
//   },

//   // Subscribe to ingestion jobs
//   subscribeToIngestionJobs(callback: (payload: any) => void) {
//     return supabase
//       .channel('ingestion_jobs')
//       .on('postgres_changes',
//         { event: '*', schema: 'public', table: 'ingestion_jobs' },
//         callback
//       )
//       .subscribe()
//   }
// }

// export default supabase
