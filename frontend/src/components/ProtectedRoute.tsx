import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ("admin" | "manager" | "analyst" | "buyer" | "auditor")[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // راه حل موقت: بررسی localStorage مستقیماً
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // اگر نیاز به احراز هویت نباشد، مستقیم برو
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // راه حل موقت: اگر در localStorage علامت احراز هویت وجود دارد، اجازه دسترسی بده
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user && !isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // If user is logged in but doesn't have required role (موقتاً غیرفعال)
  // if (user && requiredRoles.length > 0) {
  //   const hasRequiredRole = requiredRoles.includes(user.role as any);
  //   if (!hasRequiredRole) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-center space-y-4 max-w-md">
  //           <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
  //           <p className="text-muted-foreground">
  //             You don't have permission to access this page. Required roles: {requiredRoles.join(", ")}
  //           </p>
  //           <p className="text-sm text-muted-foreground">
  //             Your current role: {user.role}
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  return <>{children}</>;
}