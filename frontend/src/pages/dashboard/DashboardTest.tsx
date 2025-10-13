// src/pages/dashboard/DashboardTest.tsx
import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Clock, DollarSign, Users, AlertCircle } from "lucide-react";

export default function DashboardTest() {
  // داده‌های نمونه
  const mockData = {
    totalRequests: 2847,
    activeRequests: 342,
    totalCost: "۲۴۵B",
    avgTimeToMRS: 14.2,
    estimatedFTEs: 18
  };

  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Procurement Overview - TEST MODE
          </h1>
          <p className="text-muted-foreground mt-1">
            Using mock data - UI components test
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Requests (YTD)"
            value={mockData.totalRequests.toString()}
            subtitle={`Active: ${mockData.activeRequests}`}
            icon={ShoppingCart}
            trend={{ value: 12.5, isPositive: true }}
            variant="default"
          />
          <KPICard
            title="Total Cost (IRR)"
            value={mockData.totalCost}
            subtitle="Converted to IRR"
            icon={DollarSign}
            trend={{ value: 8.3, isPositive: true }}
            variant="success"
          />
          <KPICard
            title="Avg. Time to MRS"
            value={mockData.avgTimeToMRS.toString()}
            subtitle="days"
            icon={Clock}
            trend={{ value: -5.1, isPositive: true }}
            variant="default"
          />
          <KPICard
            title="Estimated FTEs"
            value={mockData.estimatedFTEs.toString()}
            subtitle="To clear backlog in 30 days"
            icon={Users}
            variant="warning"
          />
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Monthly Request Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart: Requests per month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Cost by Purchase Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Chart: Cost distribution</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">1,842</p>
                </div>
                <div className="text-success">64.7%</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-warning">863</p>
                </div>
                <div className="text-warning">30.3%</div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Flagged</p>
                  <p className="text-2xl font-bold text-destructive">142</p>
                </div>
                <div className="text-destructive">5.0%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}