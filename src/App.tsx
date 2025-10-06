import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import RequestDetail from "./pages/RequestDetail";
import Ingest from "./pages/Ingest";
import ExchangeRates from "./pages/ExchangeRates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requests" 
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/requests/:id" 
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ingest" 
              element={
                <ProtectedRoute requiredRoles={["admin", "manager"]}>
                  <Ingest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exchange-rates" 
              element={
                <ProtectedRoute requiredRoles={["admin", "manager"]}>
                  <ExchangeRates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
