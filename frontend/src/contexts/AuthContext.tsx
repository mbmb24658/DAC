import { User, Session, LoginForm, RegisterForm, Notification, NotificationPreferences, UserSettings } from "@/types/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

interface AuthContextType {
  // Core Auth State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: {
    name: string;
    role?: "admin" | "manager" | "analyst" | "buyer" | "auditor";
    department?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Role & Permission Methods
  hasRole: (role: "admin" | "manager" | "analyst" | "buyer" | "auditor" | "department" | "expert" | "user") => boolean;
  hasAnyRole: (roles: ("admin" | "manager" | "analyst" | "buyer" | "auditor" | "department" | "expert" | "user")[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManagerOrAdmin: () => boolean;
  isDepartmentHead: () => boolean;
  
  // Notification Methods
  notifications: Notification[];
  unreadNotifications: number;
  markNotificationAsRead: (notificationId: number) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotification: (notificationId: number) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Settings Methods
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  
  // Session Management
  updateSession: (sessionData: Partial<Session>) => void;
  getAccessToken: () => string | null;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user settings
const defaultUserSettings: UserSettings = {
  theme: 'light',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email_notifications: true,
    push_notifications: true,
    request_updates: true,
    assignment_notifications: true,
    system_alerts: true,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const isAuthenticated = !!session && !!user;

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const savedSettings = localStorage.getItem('userSettings');
        
        if (token && userData) {
          const userObj: User = JSON.parse(userData);
          const sessionData: Session = {
            user: userObj,
            token: token
          };
          setSession(sessionData);
          setUser(userObj);
          
          // Load user settings
          if (savedSettings) {
            setUserSettings(JSON.parse(savedSettings));
          } else {
            setUserSettings(defaultUserSettings);
            localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings));
          }
          
          // Verify token validity
          await validateToken();
          
          // Load notifications
          await loadNotifications();
        } else {
          setUserSettings(defaultUserSettings);
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Load user notifications
  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  // Validate token with server
  const validateToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      // Token is invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSession(null);
      setUser(null);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const credentials: LoginForm = { email, password };
      const response = await api.post('/auth/login', credentials);
      
      if (response.data) {
        const { token, user: userData } = response.data;
        const sessionData: Session = {
          user: userData,
          token: token
        };
        
        setSession(sessionData);
        setUser(userData);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Load notifications after sign in
        await loadNotifications();
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
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
      const registerData: RegisterForm = {
        name: userData.name,
        email: email,
        password: password,
        role: userData.role || 'user',
        department_id: userData.department ? parseInt(userData.department): undefined //تبدیل به Number
      };
      
      const response = await api.post('/auth/register', registerData);
      
      if (response.data) {
        // After successful registration, sign in the user
        await signIn(email, password);
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Call logout API in backend (optional)
      try {
        await api.post('/auth/logout');
      } catch (error) {
        console.warn("Logout API call failed:", error);
      }
      
      // Clear localStorage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setSession(null);
      setUser(null);
      setNotifications([]);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data) {
        const { token, user: userData } = response.data;
        const sessionData: Session = {
          user: userData,
          token: token
        };
        
        setSession(sessionData);
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Session refresh failed:", error);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await api.put('/auth/profile', userData);
      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        setSession(prev => prev ? { ...prev, user: updatedUser } : null);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await api.put('/auth/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      console.error("Password change failed:", error);
      throw error;
    }
  };

  // Role & Permission Methods
  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(user?.role as string);
  };

  const hasPermission = (permission: string) => {
    // Simple permission logic - extend based on your needs
    const permissions: Record<string, string[]> = {
      admin: ['*'],
      manager: ['manage_requests', 'view_reports', 'assign_tasks'],
      department: ['create_requests', 'view_department_requests'],
      expert: ['view_assigned_requests', 'update_request_status'],
      user: ['create_requests', 'view_own_requests'],
    };
    
    const userPermissions = permissions[user?.role || 'user'] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isManagerOrAdmin = () => {
    return user?.role === 'admin' || user?.role === 'manager';
  };

  const isDepartmentHead = () => {
    return user?.role === 'department';
  };

  // Notification Methods
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearNotification = async (notificationId: number) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to clear notification:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  // Settings Methods
  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    try {
      const newSettings = { ...userSettings, ...settings } as UserSettings;
      setUserSettings(newSettings);
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      
      // Send to server if user is authenticated
      if (isAuthenticated) {
        await api.put('/auth/settings', { settings: newSettings });
      }
    } catch (error) {
      console.error("Failed to update user settings:", error);
    }
  };

  const updateNotificationPreferences = async (preferences: Partial<NotificationPreferences>) => {
    if (!userSettings) return;
    
    const newPreferences = { ...userSettings.notifications, ...preferences };
    await updateUserSettings({ notifications: newPreferences });
  };

  // Session Management
  const updateSession = (sessionData: Partial<Session>) => {
    if (session) {
      const updatedSession = { ...session, ...sessionData };
      setSession(updatedSession);
    }
  };

  const getAccessToken = () => {
    return localStorage.getItem('token');
  };

  const value: AuthContextType = {
    // Core Auth State
    user,
    session,
    isLoading,
    isAuthenticated,
    
    // Auth Methods
    signIn,
    signUp,
    signOut,
    refreshSession,
    updateProfile,
    changePassword,
    
    // Role & Permission Methods
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin,
    isManagerOrAdmin,
    isDepartmentHead,
    
    // Notification Methods
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    clearAllNotifications,
    
    // Settings Methods
    userSettings,
    updateUserSettings,
    updateNotificationPreferences,
    
    // Session Management
    updateSession,
    getAccessToken,
    validateToken,
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