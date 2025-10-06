import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient, authHelpers, type User, type Session } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: {
    name: string;
    role?: "admin" | "manager" | "analyst" | "buyer" | "auditor";
    department?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: "admin" | "manager" | "analyst" | "buyer" | "auditor") => boolean;
  hasAnyRole: (roles: ("admin" | "manager" | "analyst" | "buyer" | "auditor")[]) => boolean;
  isAdmin: () => boolean;
  isManagerOrAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionResult = await authClient.getSession();
        if (sessionResult.data) {
          setSession(sessionResult.data);
          setUser(sessionResult.data.user);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const unsubscribe = authClient.onSessionChange((session) => {
      setSession(session);
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authHelpers.signIn(email, password);
      if (result.data) {
        setSession(result.data);
        setUser(result.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role?: "admin" | "manager" | "analyst" | "buyer" | "auditor";
    department?: string;
  }) => {
    setIsLoading(true);
    try {
      const result = await authHelpers.signUp(email, password, userData);
      if (result.data) {
        setSession(result.data);
        setUser(result.data.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authHelpers.signOut();
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: "admin" | "manager" | "analyst" | "buyer" | "auditor") => {
    return authHelpers.hasRole(user, role);
  };

  const hasAnyRole = (roles: ("admin" | "manager" | "analyst" | "buyer" | "auditor")[]) => {
    return authHelpers.hasAnyRole(user, roles);
  };

  const isAdmin = () => {
    return authHelpers.isAdmin(user);
  };

  const isManagerOrAdmin = () => {
    return authHelpers.isManagerOrAdmin(user);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole,
    hasAnyRole,
    isAdmin,
    isManagerOrAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
