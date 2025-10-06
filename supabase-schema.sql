-- =====================================================
-- Procurement Chain Data Analyzer - Supabase Schema
-- =====================================================
-- This schema supports a production-grade analytics system for 
-- procurement data ingestion, normalization, KPI tracking, and 
-- predictive ETA calculations with comprehensive reporting.

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUMS
-- =====================================================

-- Request status enumeration
CREATE TYPE request_status AS ENUM (
    'draft',
    'submitted', 
    'in_progress',
    'mrs_issued',
    'sourcing',
    'evaluation',
    'order_placed',
    'completed',
    'cancelled',
    'flagged'
);

-- User roles enumeration
CREATE TYPE user_role AS ENUM (
    'admin',
    'manager', 
    'analyst',
    'buyer',
    'auditor'
);

-- Purchase circle types
CREATE TYPE purchase_circle AS ENUM (
    'بسپاران',  -- Basparan (Industrial)
    'صنعتی',    -- Sanati (Industrial)
    'خدماتی',   -- Khadmati (Service)
    'عمومی'     -- Omumi (General)
);

-- Ingestion job status
CREATE TYPE ingestion_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
);

-- Alert types
CREATE TYPE alert_type AS ENUM (
    'info',
    'warning',
    'error',
    'success'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'analyst',
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Better Auth required tables
CREATE TABLE public.session (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.account (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP WITH TIME ZONE,
    refresh_token_expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, provider_id)
);

CREATE TABLE public.verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchange rates for currency conversion
CREATE TABLE public.exchange_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    currency_code TEXT NOT NULL,
    year INTEGER NOT NULL,
    rate_to_irr DECIMAL(15,2) NOT NULL,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(currency_code, year)
);

-- Purchase circles configuration
CREATE TABLE public.purchase_circles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    name_persian TEXT NOT NULL,
    type purchase_circle NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Procurement requests (main entity)
CREATE TABLE public.procurement_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_number TEXT UNIQUE NOT NULL,
    requester_id UUID REFERENCES public.users(id),
    requester_name TEXT NOT NULL,
    department TEXT,
    purchase_circle_id UUID REFERENCES public.purchase_circles(id),
    purchase_circle_name TEXT NOT NULL,
    
    -- Request details
    status request_status DEFAULT 'draft',
    request_date DATE NOT NULL,
    order_amount DECIMAL(15,2) NOT NULL,
    currency_code TEXT NOT NULL DEFAULT 'USD',
    order_amount_irr DECIMAL(15,2), -- Calculated field
    
    -- Timeline dates
    mrs_date DATE,
    entered_purchase_circle_date DATE,
    sourcing_start_date DATE,
    evaluation_start_date DATE,
    order_placement_date DATE,
    completion_date DATE,
    
    -- Calculated fields
    estimated_eta DATE,
    days_to_mrs INTEGER,
    days_in_sourcing INTEGER,
    days_in_evaluation INTEGER,
    total_duration_days INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- Request items (line items for each request)
CREATE TABLE public.request_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.procurement_requests(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    item_description TEXT,
    quantity INTEGER,
    unit_price DECIMAL(15,2),
    total_price DECIMAL(15,2),
    currency_code TEXT NOT NULL DEFAULT 'USD',
    total_price_irr DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data ingestion jobs tracking
CREATE TABLE public.ingestion_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'DB.xlsx', 'DB2.xlsx', etc.
    status ingestion_status DEFAULT 'pending',
    total_rows INTEGER DEFAULT 0,
    success_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    error_details JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingestion job details (row-level tracking)
CREATE TABLE public.ingestion_job_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.ingestion_jobs(id) ON DELETE CASCADE,
    row_number INTEGER NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed', 'skipped'
    error_message TEXT,
    raw_data JSONB,
    processed_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System alerts and notifications
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type alert_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    user_id UUID REFERENCES public.users(id), -- NULL for system-wide alerts
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Request timeline/audit log
CREATE TABLE public.request_timeline (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.procurement_requests(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    previous_status request_status,
    new_status request_status,
    stage_date DATE,
    duration_days INTEGER,
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Procurement requests indexes
CREATE INDEX idx_procurement_requests_status ON public.procurement_requests(status);
CREATE INDEX idx_procurement_requests_date ON public.procurement_requests(request_date);
CREATE INDEX idx_procurement_requests_requester ON public.procurement_requests(requester_id);
CREATE INDEX idx_procurement_requests_circle ON public.procurement_requests(purchase_circle_id);
CREATE INDEX idx_procurement_requests_number ON public.procurement_requests(request_number);
CREATE INDEX idx_procurement_requests_eta ON public.procurement_requests(estimated_eta);

-- Exchange rates indexes
CREATE INDEX idx_exchange_rates_currency_year ON public.exchange_rates(currency_code, year);

-- Ingestion jobs indexes
CREATE INDEX idx_ingestion_jobs_status ON public.ingestion_jobs(status);
CREATE INDEX idx_ingestion_jobs_created ON public.ingestion_jobs(created_at);

-- Alerts indexes
CREATE INDEX idx_alerts_user_unread ON public.alerts(user_id, is_read) WHERE user_id IS NOT NULL;
CREATE INDEX idx_alerts_system_unread ON public.alerts(is_read) WHERE user_id IS NULL;

-- Timeline indexes
CREATE INDEX idx_request_timeline_request ON public.request_timeline(request_id);
CREATE INDEX idx_request_timeline_date ON public.request_timeline(stage_date);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchange_rates_updated_at BEFORE UPDATE ON public.exchange_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_procurement_requests_updated_at BEFORE UPDATE ON public.procurement_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate IRR amount
CREATE OR REPLACE FUNCTION calculate_irr_amount(
    amount DECIMAL,
    currency TEXT,
    request_date DATE
) RETURNS DECIMAL AS $$
DECLARE
    rate DECIMAL;
    year_val INTEGER;
BEGIN
    year_val := EXTRACT(YEAR FROM request_date);
    
    -- Get exchange rate for the year
    SELECT rate_to_irr INTO rate
    FROM public.exchange_rates
    WHERE currency_code = currency AND year = year_val;
    
    -- If no rate for current year, get latest prior year
    IF rate IS NULL THEN
        SELECT rate_to_irr INTO rate
        FROM public.exchange_rates
        WHERE currency_code = currency AND year < year_val
        ORDER BY year DESC
        LIMIT 1;
    END IF;
    
    -- If still no rate, return NULL
    IF rate IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN amount * rate;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate ETA based on historical data
CREATE OR REPLACE FUNCTION calculate_eta(
    p_request_id UUID
) RETURNS DATE AS $$
DECLARE
    req_record RECORD;
    avg_duration INTEGER;
    eta_date DATE;
BEGIN
    -- Get request details
    SELECT * INTO req_record
    FROM public.procurement_requests
    WHERE id = p_request_id;
    
    -- Calculate average duration for similar requests
    SELECT AVG(total_duration_days)::INTEGER INTO avg_duration
    FROM public.procurement_requests
    WHERE purchase_circle_id = req_record.purchase_circle_id
    AND status = 'completed'
    AND total_duration_days IS NOT NULL
    AND created_at >= NOW() - INTERVAL '12 months';
    
    -- If no historical data, use default duration
    IF avg_duration IS NULL THEN
        avg_duration := 30; -- Default 30 days
    END IF;
    
    -- Calculate ETA
    eta_date := req_record.request_date + INTERVAL '1 day' * avg_duration;
    
    RETURN eta_date;
END;
$$ LANGUAGE plpgsql;

-- Function to update request timeline
CREATE OR REPLACE FUNCTION update_request_timeline()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert timeline entry when status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.request_timeline (
            request_id,
            stage,
            previous_status,
            new_status,
            stage_date,
            created_by
        ) VALUES (
            NEW.id,
            NEW.status::TEXT,
            OLD.status,
            NEW.status,
            CURRENT_DATE,
            NEW.updated_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timeline trigger
CREATE TRIGGER update_procurement_timeline 
    AFTER UPDATE ON public.procurement_requests 
    FOR EACH ROW EXECUTE FUNCTION update_request_timeline();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_job_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Better Auth table policies
CREATE POLICY "Users can manage their own sessions" ON public.session
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own accounts" ON public.account
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Allow verification table access" ON public.verification
    FOR ALL USING (true);

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update user roles" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow user creation" ON public.users
    FOR INSERT WITH CHECK (true);

-- Procurement requests policies
CREATE POLICY "Users can view requests based on role" ON public.procurement_requests
    FOR SELECT USING (
        CASE 
            WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'auditor'))
            THEN true
            WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'buyer')
            THEN purchase_circle_id IN (
                SELECT id FROM public.purchase_circles 
                WHERE name IN ('بسپاران', 'صنعتی', 'خدماتی', 'عمومی')
            )
            WHEN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'analyst')
            THEN requester_id = auth.uid()
            ELSE false
        END
    );

CREATE POLICY "Managers and admins can create requests" ON public.procurement_requests
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Managers and admins can update requests" ON public.procurement_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Exchange rates policies
CREATE POLICY "All authenticated users can view exchange rates" ON public.exchange_rates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage exchange rates" ON public.exchange_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Alerts policies
CREATE POLICY "Users can view their own alerts" ON public.alerts
    FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can mark their alerts as read" ON public.alerts
    FOR UPDATE USING (user_id = auth.uid());

-- Ingestion jobs policies
CREATE POLICY "All authenticated users can view ingestion jobs" ON public.ingestion_jobs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage ingestion jobs" ON public.ingestion_jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default purchase circles
INSERT INTO public.purchase_circles (name, name_persian, type, description) VALUES
('Basparan', 'بسپاران', 'بسپاران', 'Industrial procurement circle'),
('Sanati', 'صنعتی', 'صنعتی', 'Industrial services procurement'),
('Khadmati', 'خدماتی', 'خدماتی', 'Service procurement circle'),
('Omumi', 'عمومی', 'عمومی', 'General procurement circle');

-- Insert default exchange rates
INSERT INTO public.exchange_rates (currency_code, year, rate_to_irr) VALUES
('USD', 2024, 42000),
('EUR', 2024, 45500),
('GBP', 2024, 53000),
('USD', 2023, 38000),
('EUR', 2023, 41000),
('GBP', 2023, 48000);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
('default_language', '"en"', 'Default system language'),
('working_hours_per_day', '8', 'Working hours per day for FTE calculations'),
('auto_save_filters', 'true', 'Auto-save user filter preferences'),
('polling_frequency_minutes', '20', 'File polling frequency in minutes'),
('error_threshold_percent', '5', 'Error threshold percentage for alerts'),
('auto_retry_ingestion', 'true', 'Automatic retry for failed ingestions'),
('email_alerts_enabled', 'true', 'Enable email alerts'),
('dq_queue_notifications', 'true', 'Data quality queue notifications');

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- KPI summary view
CREATE VIEW public.kpi_summary AS
SELECT 
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'in_progress') as active_requests,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
    COUNT(*) FILTER (WHERE status = 'flagged') as flagged_requests,
    SUM(order_amount_irr) as total_cost_irr,
    AVG(days_to_mrs) as avg_days_to_mrs,
    AVG(total_duration_days) as avg_total_duration
FROM public.procurement_requests
WHERE request_date >= DATE_TRUNC('year', CURRENT_DATE);

-- Monthly request trends view
CREATE VIEW public.monthly_request_trends AS
SELECT 
    DATE_TRUNC('month', request_date) as month,
    COUNT(*) as request_count,
    SUM(order_amount_irr) as total_cost_irr,
    AVG(total_duration_days) as avg_duration
FROM public.procurement_requests
WHERE request_date >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY DATE_TRUNC('month', request_date)
ORDER BY month;

-- Purchase circle performance view
CREATE VIEW public.purchase_circle_performance AS
SELECT 
    pc.name as circle_name,
    pc.name_persian as circle_name_persian,
    COUNT(pr.id) as total_requests,
    AVG(pr.total_duration_days) as avg_duration,
    SUM(pr.order_amount_irr) as total_cost_irr,
    COUNT(pr.id) FILTER (WHERE pr.status = 'completed') as completed_count,
    ROUND(
        COUNT(pr.id) FILTER (WHERE pr.status = 'completed')::DECIMAL / 
        NULLIF(COUNT(pr.id), 0) * 100, 2
    ) as completion_rate
FROM public.purchase_circles pc
LEFT JOIN public.procurement_requests pr ON pc.id = pr.purchase_circle_id
GROUP BY pc.id, pc.name, pc.name_persian;

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
