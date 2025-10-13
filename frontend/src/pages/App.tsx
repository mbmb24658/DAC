import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";

// صفحات احراز هویت
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";

// صفحات اصلی
import DashboardTest from "@/pages/dashboard/DashboardTest";
import Requests from "@/pages/requests/Requests";
import RequestDetail from "@/pages/requests/RequestDetail";
import DepartmentDashboard from '@/pages/departments/DepartmentDashboard';
import ExpertDashboard from '@/pages/departments/ExpertDashboard';

// صفحات کمکی
import NotFound from "@/pages/shared/NotFound";
import { ToastProvider } from "@/components/ui/use-toast"
import SimpleTest from "@/pages/SimpleTest";

// صفحات مدیریتی
import Ingest from "@/pages/shared/Ingest";
import Profile from "@/pages/settings/Profile";
import RequestList from '@/pages/requests/RequestList';
import ExchangeRates from "@/pages/shared/ExchangeRates";
import Settings from "@/pages/settings/Settings";

const queryClient = new QueryClient();

// کامپوننت برای صفحاتی که نیاز به Layout دارند
const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ToastProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/simple-test" element={<SimpleTest />} />

              {/* Protected routes با Layout */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <RequestList />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <DashboardTest />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              /> */}
              <Route 
                path="/dashboard" 
                element={
                  <DashboardTest />
                } 
              />
              
              <Route 
                path="/requests" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <Requests />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/request/:id" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <RequestDetail />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/department/:name" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <DepartmentDashboard />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/expert/:name" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <ExpertDashboard />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ingest" 
                element={
                  <ProtectedRoute requiredRoles={["admin", "manager"]}>
                    <WithLayout>
                      <Ingest />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/exchange-rates" 
                element={
                  <ProtectedRoute requiredRoles={["admin", "manager"]}>
                    <WithLayout>
                      <ExchangeRates />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <WithLayout>
                      <Settings />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <WithLayout>
                      <Profile />
                    </WithLayout>
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ToastProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;