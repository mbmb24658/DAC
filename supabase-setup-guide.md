# Procurement Chain Data Analyzer - Supabase Setup Guide

## Overview

This guide will help you set up the complete Supabase backend for the Procurement Chain Data Analyzer application. The schema supports all the features identified in your application including:

- **Automated Data Ingestion**: Excel file processing with Persian date conversion
- **Advanced Analytics**: Real-time KPIs, trend analysis, and predictive ETA calculations
- **Timeline Tracking**: Complete request lifecycle visibility
- **Role-Based Access**: Secure multi-role system (Admin, Manager, Analyst, Buyer, Auditor)
- **Workforce Planning**: FTE and man-hour calculations
- **Exportable Reports**: Comprehensive reporting capabilities

## Prerequisites

1. Supabase account and project
2. Supabase CLI installed (`npm install -g supabase`)
3. PostgreSQL knowledge (basic)

## Setup Steps

### 1. Initialize Supabase Project

```bash
# Login to Supabase
supabase login

# Initialize new project (if starting fresh)
supabase init

# Link to existing project
supabase link --project-ref YOUR_PROJECT_REF
```

### 2. Apply Database Schema

```bash
# Apply the complete schema
supabase db reset

# Or apply the schema file directly
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase-schema.sql
```

### 3. Configure Authentication

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Configure email templates
3. Set up OAuth providers if needed
4. Configure JWT settings

### 4. Set Up Row Level Security

The schema includes comprehensive RLS policies. Verify they're working:

```sql
-- Test RLS policies
SELECT * FROM public.procurement_requests; -- Should respect user role
```

### 5. Configure Storage (Optional)

If you need file storage for Excel uploads:

```sql
-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('procurement-files', 'procurement-files', false);

-- Set up storage policies
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'procurement-files');

CREATE POLICY "Users can view their files" ON storage.objects
FOR SELECT USING (bucket_id = 'procurement-files');
```

## Database Schema Overview

### Core Tables

1. **users** - User management with role-based access
2. **procurement_requests** - Main procurement request entity
3. **request_items** - Line items for each request
4. **exchange_rates** - Currency conversion rates
5. **purchase_circles** - Procurement categories
6. **ingestion_jobs** - Data import tracking
7. **alerts** - System notifications
8. **request_timeline** - Audit trail
9. **system_settings** - Configuration

### Key Features

#### 1. Currency Conversion
- Automatic IRR conversion based on request date
- Fallback to previous year rates
- Support for USD, EUR, GBP

#### 2. Timeline Tracking
- Automatic timeline updates on status changes
- Duration calculations between stages
- Historical audit trail

#### 3. Predictive Analytics
- ETA calculation based on historical data
- KPI calculations for dashboard
- Performance metrics by purchase circle

#### 4. Role-Based Security
- **Admin**: Full system access
- **Manager**: Request management, user oversight
- **Analyst**: Data analysis, reporting
- **Buyer**: Purchase circle specific access
- **Auditor**: Read-only access to all data

## Environment Variables

Add these to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## API Integration Examples

### Fetching Requests with Filters

```typescript
const { data: requests } = await supabase
  .from('procurement_requests')
  .select(`
    *,
    purchase_circles(name, name_persian),
    users(full_name),
    request_items(*)
  `)
  .eq('status', 'in_progress')
  .order('request_date', { ascending: false });
```

### Creating a New Request

```typescript
const { data, error } = await supabase
  .from('procurement_requests')
  .insert({
    request_number: 'PBS-9922003',
    requester_name: 'Ali Reza',
    department: 'Engineering',
    purchase_circle_id: circleId,
    request_date: '2024-03-15',
    order_amount: 15000,
    currency_code: 'USD'
  });
```

### Uploading and Processing Files

```typescript
// Upload file to storage
const { data: uploadData } = await supabase.storage
  .from('procurement-files')
  .upload(`uploads/${filename}`, file);

// Create ingestion job
const { data: job } = await supabase
  .from('ingestion_jobs')
  .insert({
    filename: filename,
    file_type: 'DB.xlsx',
    status: 'pending'
  });
```

## Monitoring and Maintenance

### Key Queries for Monitoring

```sql
-- Check system health
SELECT 
  (SELECT COUNT(*) FROM procurement_requests WHERE status = 'flagged') as flagged_requests,
  (SELECT COUNT(*) FROM ingestion_jobs WHERE status = 'failed') as failed_jobs,
  (SELECT COUNT(*) FROM alerts WHERE is_read = false) as unread_alerts;

-- Performance metrics
SELECT 
  purchase_circle_name,
  AVG(total_duration_days) as avg_duration,
  COUNT(*) as request_count
FROM procurement_requests 
WHERE status = 'completed'
GROUP BY purchase_circle_name;
```

### Regular Maintenance Tasks

1. **Clean up old ingestion jobs** (older than 90 days)
2. **Archive completed requests** (older than 2 years)
3. **Update exchange rates** monthly
4. **Monitor RLS policies** for performance
5. **Backup critical data** regularly

## Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check user roles and permissions
2. **Currency Conversion Issues**: Verify exchange rates exist for required years
3. **Performance Issues**: Check indexes and query optimization
4. **File Upload Issues**: Verify storage bucket permissions

### Debug Queries

```sql
-- Check user permissions
SELECT role FROM public.users WHERE id = auth.uid();

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'procurement_requests';

-- Check exchange rates
SELECT * FROM exchange_rates ORDER BY currency_code, year DESC;
```

## Security Considerations

1. **Never expose service role key** in client-side code
2. **Use RLS policies** for all data access
3. **Validate file uploads** before processing
4. **Monitor for suspicious activity** in audit logs
5. **Regular security updates** for dependencies

## Performance Optimization

1. **Use indexes** for frequently queried columns
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data**
4. **Optimize queries** with proper joins
5. **Monitor query performance** regularly

## Support

For issues or questions:
1. Check Supabase documentation
2. Review RLS policy logs
3. Monitor database performance metrics
4. Check application logs for errors

This schema provides a robust foundation for your procurement analytics system with room for future enhancements and scaling.
