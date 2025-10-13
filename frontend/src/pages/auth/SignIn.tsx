import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { email, password });
      
      // راه حل موقت: هر کاربری با هر نام کاربری/رمز عبور لاگین شود
      if (email && password) {
        console.log("Login successful (temporary bypass)...");
        
        // ذخیره ساده در localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({
          id: 1,
          username: email,
          role: "admin",
          name: "Test User"
        }));
        localStorage.setItem("token", "demo-token-bypass");
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        
        // هدایت مستقیم به dashboard
        navigate("/dashboard");
        
      } else {
        throw new Error("Please enter both username and password.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in. Please try again.");
      toast({
        title: "Sign in failed",
        description: err.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // راه حل حتی ساده‌تر: دکمه برای ورود مستقیم
  const directLogin = () => {
    console.log("Direct login bypass...");
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify({
      id: 1,
      username: "admin",
      role: "admin", 
      name: "Administrator"
    }));
    localStorage.setItem("token", "demo-token-direct");
    
    toast({
      title: "Welcome!",
      description: "Direct login successful.",
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-2 hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your procurement analytics account
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="shadow-elegant">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username (Enter anything)</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter any username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (Enter anything)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter any password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* دکمه ورود مستقیم */}
            <div className="text-center">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={directLogin}
                disabled={isLoading}
              >
                Quick Login (Bypass)
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link
                to="/sign-up"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Demo Mode</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Any username/password will work</strong></p>
                <p>Or use the "Quick Login" button</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}