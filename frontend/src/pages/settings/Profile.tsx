import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, Shield, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    role: user?.role || "analyst",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        department: formData.department,
        role: formData.role as any,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  const roleDescriptions = {
    admin: "Full system access and user management",
    manager: "Request management and team oversight",
    analyst: "Data analysis and reporting",
    buyer: "Purchase circle specific access",
    auditor: "Read-only access for compliance"
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact an administrator if needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      placeholder="Enter your department"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analyst">Analyst</SelectItem>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Save className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant={getRoleBadgeVariant(user?.role || "analyst")}>
                  {user?.role || "analyst"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Permissions</h4>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    View Dashboard
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    View Requests
                  </div>
                  {user?.role === "admin" || user?.role === "manager" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        Data Ingestion
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success" />
                        Exchange Rates
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted" />
                        Data Ingestion
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted" />
                        Exchange Rates
                      </div>
                    </>
                  )}
                  {user?.role === "admin" ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      System Settings
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted" />
                      System Settings
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
