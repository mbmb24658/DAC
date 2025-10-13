import { Link, useLocation } from "react-router-dom";
import { BarChart3, FileText, Upload, Settings, Database, Users, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["admin", "manager", "analyst", "buyer", "auditor"] },
  { name: "Requests", href: "/requests", icon: FileText, roles: ["admin", "manager", "analyst", "buyer", "auditor"] },
  { name: "Ingest Data", href: "/ingest", icon: Upload, roles: ["admin", "manager"] },
  { name: "Exchange Rates", href: "/exchange-rates", icon: Database, roles: ["admin", "manager"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["admin"] },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, signOut, hasAnyRole } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "manager": return "default";
      case "analyst": return "secondary";
      case "buyer": return "outline";
      case "auditor": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <Database className="h-8 w-8 text-sidebar-primary" />
            <span className="ml-2 text-lg font-semibold text-sidebar-foreground">
              Procurement Analytics
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation
              .filter(item => hasAnyRole(item.roles as any))
              .map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary">
                      <User className="h-5 w-5 text-sidebar-primary-foreground" />
                    </div>
                    <div className="flex-1 text-left text-sm">
                      <p className="font-medium text-sidebar-foreground truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || "user@example.com"}
                      </p>
                      <Badge 
                        variant={getRoleBadgeVariant(user?.role || "analyst")} 
                        className="text-xs mt-1"
                      >
                        {user?.role || "analyst"}
                      </Badge>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
