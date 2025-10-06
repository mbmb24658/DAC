# Better Auth Integration Setup Guide

## Overview

This guide will help you set up Better Auth authentication for your Procurement Chain Data Analyzer application. Better Auth provides a comprehensive authentication system that integrates seamlessly with your existing Supabase database.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install better-auth @better-auth/cli
```

### 2. Environment Configuration

Add these variables to your `.env` file:

```env
# Better Auth Configuration
VITE_BETTER_AUTH_SECRET=your-secret-key-change-in-production
VITE_APP_URL=http://localhost:5173

# Social Authentication (Optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. Database Setup

The Better Auth integration requires additional tables in your Supabase database. These have been added to the updated `supabase-schema.sql`:

- `session` - User session management
- `account` - OAuth and password accounts
- `verification` - Email verification and password reset

Apply the updated schema:

```bash
psql -h YOUR_DB_HOST -U postgres -d postgres -f supabase-schema.sql
```

## 🔧 Configuration Details

### Better Auth Configuration

The auth configuration in `src/lib/auth.ts` includes:

- **Email & Password Authentication**: Secure login with password requirements
- **Social Providers**: Google and GitHub OAuth (optional)
- **Session Management**: 7-day sessions with 1-day update intervals
- **User Fields**: Role, department, and active status
- **Supabase Integration**: Direct database adapter

### Role-Based Access Control

The system supports 5 user roles:

1. **Admin**: Full system access, user management
2. **Manager**: Request management, team oversight
3. **Analyst**: Data analysis, reporting
4. **Buyer**: Purchase circle specific access
5. **Auditor**: Read-only access for compliance

### Protected Routes

Routes are protected based on user roles:

- `/dashboard` - All authenticated users
- `/requests` - All authenticated users
- `/ingest` - Admin and Manager only
- `/exchange-rates` - Admin and Manager only
- `/settings` - Admin only
- `/profile` - All authenticated users

## 📱 Authentication Pages

### Sign In Page (`/sign-in`)

Features:
- Email and password authentication
- Password visibility toggle
- Demo credentials for testing
- Error handling and validation
- Redirect to dashboard on success

### Sign Up Page (`/sign-up`)

Features:
- User registration with role selection
- Department information (optional)
- Password confirmation
- Role descriptions
- Success confirmation

### Profile Page (`/profile`)

Features:
- User information management
- Role and department updates
- Account status display
- Permission overview
- Profile picture placeholder

## 🔐 Security Features

### Row Level Security (RLS)

Comprehensive RLS policies ensure:
- Users can only access their own data
- Role-based data visibility
- Secure session management
- Protected user accounts

### Authentication Flow

1. **Sign Up**: Creates user in Supabase auth and public.users table
2. **Sign In**: Validates credentials and creates session
3. **Session Management**: Automatic token refresh and validation
4. **Sign Out**: Clears session and redirects to home

## 🎯 Usage Examples

### Using the Auth Context

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, signOut, hasRole, isAdmin } = useAuth();

  if (isAdmin()) {
    return <AdminPanel />;
  }

  return <UserPanel />;
}
```

### Protected Route Component

```typescript
import ProtectedRoute from "@/components/ProtectedRoute";

// Protect route for all authenticated users
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Protect route for specific roles
<ProtectedRoute requiredRoles={["admin", "manager"]}>
  <AdminPanel />
</ProtectedRoute>
```

### Auth Helper Functions

```typescript
import { authHelpers } from "@/lib/auth";

// Sign up a new user
await authHelpers.signUp("user@example.com", "password123", {
  name: "John Doe",
  role: "analyst",
  department: "Engineering"
});

// Check user permissions
const canManageUsers = authHelpers.hasRole(user, "admin");
const canAccessAdmin = authHelpers.hasAnyRole(user, ["admin", "manager"]);
```

## 🧪 Testing

### Demo Credentials

The sign-in page includes demo credentials for testing:

- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **Analyst**: analyst@example.com / analyst123

### Test User Creation

You can create test users through the sign-up page or directly in Supabase:

```sql
-- Create test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW()
);

-- Create user profile
INSERT INTO public.users (id, email, name, role, department)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test User',
  'analyst',
  'Engineering'
);
```

## 🔄 Integration with Existing Features

### Dashboard Integration

The dashboard now shows user-specific data based on role:
- Admins see all requests
- Managers see their team's requests
- Analysts see their own requests
- Buyers see their purchase circle requests

### Navigation Menu

The sidebar navigation adapts based on user role:
- Role-specific menu items
- User information display
- Sign-out functionality

### Data Access

All data access is now filtered by user permissions:
- RLS policies enforce access control
- API calls include user context
- Role-based feature visibility

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check environment variables
   - Verify Supabase connection
   - Ensure RLS policies are applied

2. **Role-Based Access Issues**
   - Verify user role in database
   - Check RLS policy conditions
   - Confirm route protection setup

3. **Session Management Problems**
   - Check session table exists
   - Verify session policies
   - Clear browser storage if needed

### Debug Commands

```sql
-- Check user roles
SELECT id, email, name, role FROM public.users;

-- Check sessions
SELECT * FROM public.session WHERE user_id = 'user-id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 📈 Production Considerations

### Security

1. **Change Default Secret**: Update `VITE_BETTER_AUTH_SECRET`
2. **Enable Email Verification**: Set `requireEmailVerification: true`
3. **Use HTTPS**: Ensure secure connections
4. **Regular Security Updates**: Keep dependencies updated

### Performance

1. **Session Cleanup**: Implement session cleanup jobs
2. **Database Indexes**: Monitor query performance
3. **Caching**: Consider session caching strategies

### Monitoring

1. **Auth Logs**: Monitor authentication events
2. **Failed Logins**: Track security incidents
3. **User Activity**: Monitor user engagement

## 🔗 Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs/introduction)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🎉 Next Steps

1. **Test the Authentication Flow**: Sign up, sign in, and test role-based access
2. **Customize User Roles**: Modify roles and permissions as needed
3. **Add Social Authentication**: Configure Google/GitHub OAuth
4. **Implement Email Verification**: Enable email confirmation
5. **Add Two-Factor Authentication**: Enhance security with 2FA

Your Better Auth integration is now complete and ready for production use!
