# Procurement Chain Data Analyzer - Database Schema

## Overview

This repository contains a complete Supabase database schema for the **Procurement Chain Data Analyzer** application. The schema supports all the features identified in your application including automated data ingestion, advanced analytics, timeline tracking, role-based access control, and comprehensive reporting.

## 🚀 Quick Start

### 1. Prerequisites

- Supabase account and project
- Supabase CLI installed: `npm install -g supabase`
- PostgreSQL knowledge (basic)

### 2. Setup

```bash
# Clone or download the schema file
# Apply the schema to your Supabase project
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase-schema.sql

# Or use Supabase CLI
supabase db reset
```

### 3. Environment Variables

Copy `env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User management | Role-based access, extends Supabase auth |
| `procurement_requests` | Main request entity | Status tracking, timeline, currency conversion |
| `request_items` | Line items | Detailed item breakdown per request |
| `exchange_rates` | Currency conversion | Year-based rates with fallback logic |
| `purchase_circles` | Categories | Persian/English names, type classification |
| `ingestion_jobs` | File processing | Excel upload tracking, error handling |
| `alerts` | Notifications | System alerts, user-specific messages |
| `request_timeline` | Audit trail | Complete request lifecycle tracking |
| `system_settings` | Configuration | Application settings, user preferences |

### Key Features

#### 🔄 Automated Currency Conversion
- Automatic IRR conversion based on request date
- Fallback to previous year rates if current year unavailable
- Support for USD, EUR, GBP with extensible design

#### 📈 Predictive Analytics
- ETA calculation based on historical data
- KPI calculations for dashboard metrics
- Performance analysis by purchase circle

#### 🔐 Role-Based Security
- **Admin**: Full system access
- **Manager**: Request management, user oversight
- **Analyst**: Data analysis, reporting
- **Buyer**: Purchase circle specific access
- **Auditor**: Read-only access to all data

#### 📋 Timeline Tracking
- Automatic timeline updates on status changes
- Duration calculations between stages
- Historical audit trail with user attribution

## 🛠️ Advanced Features

### Database Functions

#### `calculate_irr_amount(amount, currency, request_date)`
Automatically converts foreign currency amounts to IRR using the appropriate exchange rate.

#### `calculate_eta(request_id)`
Predicts completion date based on historical performance data for similar requests.

#### `update_request_timeline()`
Automatically creates timeline entries when request status changes.

### Views for Analytics

#### `kpi_summary`
Real-time KPI calculations including:
- Total requests (YTD)
- Active vs completed requests
- Total cost in IRR
- Average processing times

#### `monthly_request_trends`
Monthly aggregation of:
- Request volume
- Total costs
- Average duration

#### `purchase_circle_performance`
Performance metrics by purchase circle:
- Request counts
- Average duration
- Completion rates
- Total costs

### Row Level Security (RLS)

Comprehensive security policies ensure:
- Users only see data appropriate for their role
- Buyers see only their assigned purchase circles
- Analysts see only their own requests
- Admins and managers have full access
- Auditors have read-only access to all data

## 📁 File Structure

```
├── supabase-schema.sql          # Complete database schema
├── supabase-setup-guide.md      # Detailed setup instructions
├── src/
│   ├── types/
│   │   └── database.ts          # TypeScript type definitions
│   └── lib/
│       └── supabase.ts          # Supabase client configuration
├── env.example                  # Environment variables template
└── DATABASE_README.md           # This file
```

## 🔧 API Integration

### TypeScript Support

The schema includes complete TypeScript definitions in `src/types/database.ts`:

```typescript
import type { Database } from '@/types/database'

// Fully typed Supabase client
const supabase = createClient<Database>(url, key)

// Type-safe queries
const { data } = await supabase
  .from('procurement_requests')
  .select('*')
  .eq('status', 'in_progress')
```

### Pre-built API Functions

The `src/lib/supabase.ts` file includes ready-to-use functions:

```typescript
import { requests, analytics, auth } from '@/lib/supabase'

// Get requests with filters
const requests = await requests.getAll({
  status: ['in_progress', 'flagged'],
  date_from: '2024-01-01'
})

// Get KPI summary
const kpis = await analytics.getKPISummary()

// User authentication
const user = await auth.getCurrentUserProfile()
```

## 📊 Sample Data

The schema includes initial data:

### Purchase Circles
- بسپاران (Basparan) - Industrial
- صنعتی (Sanati) - Industrial Services  
- خدماتی (Khadmati) - Service
- عمومی (Omumi) - General

### Exchange Rates
- USD, EUR, GBP for 2023-2024
- Configurable rates with automatic fallback

### System Settings
- Default language, working hours
- File upload settings, error thresholds
- Notification preferences

## 🔍 Monitoring & Maintenance

### Key Queries for Monitoring

```sql
-- System health check
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

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| RLS Policy Errors | Check user roles and permissions |
| Currency Conversion Issues | Verify exchange rates exist for required years |
| Performance Issues | Check indexes and query optimization |
| File Upload Issues | Verify storage bucket permissions |

### Debug Queries

```sql
-- Check user permissions
SELECT role FROM public.users WHERE id = auth.uid();

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'procurement_requests';

-- Check exchange rates
SELECT * FROM exchange_rates ORDER BY currency_code, year DESC;
```

## 🔒 Security Considerations

1. **Never expose service role key** in client-side code
2. **Use RLS policies** for all data access
3. **Validate file uploads** before processing
4. **Monitor for suspicious activity** in audit logs
5. **Regular security updates** for dependencies

## ⚡ Performance Optimization

1. **Use indexes** for frequently queried columns
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data**
4. **Optimize queries** with proper joins
5. **Monitor query performance** regularly

## 📈 Scaling Considerations

The schema is designed to handle:
- **High volume**: Optimized indexes and pagination
- **Multi-tenant**: Role-based data isolation
- **Real-time**: Built-in subscription support
- **Analytics**: Pre-computed views and functions
- **Internationalization**: Persian/English support

## 🤝 Support

For issues or questions:
1. Check the setup guide: `supabase-setup-guide.md`
2. Review RLS policy logs in Supabase dashboard
3. Monitor database performance metrics
4. Check application logs for errors

## 📝 License

This database schema is part of the Procurement Chain Data Analyzer project and follows the same licensing terms.

---

**Ready to get started?** Follow the setup guide in `supabase-setup-guide.md` to deploy this schema to your Supabase project!
