// src/types/database.ts
export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'analyst' | 'buyer' | 'auditor' | 'viewer';
  created_at?: string;
}

export interface Session {
  user: User;
  token: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: string;
  department_id?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  request_updates: boolean;
  assignment_notifications: boolean;
  system_alerts: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
}

export interface PurchaseRequest {
  id: number;
  request_number: string;
  item_count: number;
  industrial_flag: string;
  purchase_department: string;
  purchase_expert: string;
  applicant: string;
  applicant_company: string;
  applicant_unit: string;
  consumer_company: string;
  consumer_unit: string;
  latest_status: string;
  winning_source: string;
  date_request: string;
  date_mrs: string;
  date_entry: string;
  purchase_duration: string;
  initial_amount: number;
  currency_unit: string;
  order_amount: number;
  order_currency: string;
  extra_cost_rial: number;
  converted_cost_rial: number;
  notes: string;
  transaction_type: string;
  external_id: string;
  date_start: string;
  date_end: string;
  urgency_code: string;
  date_order: string;
  first_item_description: string;
  created_at: string;
}