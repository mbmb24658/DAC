// =====================================================
// Better Auth Configuration for Procurement Chain Data Analyzer
// =====================================================

import { betterAuth } from "better-auth"
import { supabaseAdapter } from "better-auth/adapters/supabase"
import { supabase } from "./supabase"

// Better Auth configuration
export const auth = betterAuth({
  database: supabaseAdapter(supabase, {
    provider: "supabase"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "analyst",
        required: true,
      },
      department: {
        type: "string",
        required: false,
      },
      is_active: {
        type: "boolean",
        defaultValue: true,
        required: true,
      },
    },
  },
  plugins: [
    // Add plugins here as needed
  ],
  trustedOrigins: [
    import.meta.env.VITE_APP_URL || "http://localhost:5173",
  ],
  baseURL: import.meta.env.VITE_APP_URL || "http://localhost:5173",
  secret: import.meta.env.VITE_BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
})

// Auth client for frontend
export const authClient = auth.createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL || "http://localhost:5173",
})

// Export types
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User

// Auth helper functions
export const authHelpers = {
  // Sign up with role assignment
  async signUp(email: string, password: string, userData: {
    name: string
    role?: "admin" | "manager" | "analyst" | "buyer" | "auditor"
    department?: string
  }) {
    const result = await authClient.signUp.email({
      email,
      password,
      name: userData.name,
      role: userData.role || "analyst",
      department: userData.department,
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result
  },

  // Sign in
  async signIn(email: string, password: string) {
    const result = await authClient.signIn.email({
      email,
      password,
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result
  },

  // Sign out
  async signOut() {
    const result = await authClient.signOut()
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result
  },

  // Get current session
  async getSession() {
    const result = await authClient.getSession()
    return result
  },

  // Get current user
  async getUser() {
    const session = await authClient.getSession()
    return session.data?.user || null
  },

  // Update user profile
  async updateProfile(updates: {
    name?: string
    role?: "admin" | "manager" | "analyst" | "buyer" | "auditor"
    department?: string
  }) {
    const result = await authClient.updateUser({
      name: updates.name,
      role: updates.role,
      department: updates.department,
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    return result
  },

  // Check if user has specific role
  hasRole(user: User | null, role: "admin" | "manager" | "analyst" | "buyer" | "auditor"): boolean {
    if (!user) return false
    return user.role === role
  },

  // Check if user has any of the specified roles
  hasAnyRole(user: User | null, roles: ("admin" | "manager" | "analyst" | "buyer" | "auditor")[]): boolean {
    if (!user) return false
    return roles.includes(user.role as any)
  },

  // Check if user is admin
  isAdmin(user: User | null): boolean {
    return this.hasRole(user, "admin")
  },

  // Check if user is manager or admin
  isManagerOrAdmin(user: User | null): boolean {
    return this.hasAnyRole(user, ["admin", "manager"])
  },
}

export default auth
