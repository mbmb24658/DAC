import Layout from "@/components/Layout";
import KPICard from "@/components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Procurement Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time analytics and insights for procurement operations
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Requests (YTD)"
            value="2,847"
            subtitle="Active: 342"
            icon={ShoppingCart}
            trend={{ value: 12.5, isPositive: true }}
            variant="default"
          />
          <KPICard
            title="Total Cost (IRR)"
            value="۲۴۵B"
            subtitle="Converted to IRR"
            icon={DollarSign}
            trend={{ value: 8.3, isPositive: true }}
            variant="success"
          />
          <KPICard
            title="Avg. Time to MRS"
            value="14.2"
            subtitle="days"
            icon={Clock}
            trend={{ value: -5.1, isPositive: true }}
            variant="default"
          />
          <KPICard
            title="Estimated FTEs"
            value="18"
            subtitle="To clear backlog in 30 days"
            icon={Users}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Requests Trend */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Monthly Request Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground">Chart: Requests per month (last 24 months)</p>
              </div>
            </CardContent>
          </Card>

          {/* Cost by Circle */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Cost by Purchase Circle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <p className="text-muted-foreground">Chart: Cost distribution by circle</p>
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

        {/* Recent Alerts */}
        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Recent Alerts & Data Quality Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: "warning", message: "23 requests missing MRS dates", time: "2 hours ago" },
                { type: "error", message: "Currency conversion rate missing for EUR 2023", time: "5 hours ago" },
                { type: "info", message: "Ingestion completed: 142 rows processed", time: "1 day ago" },
              ].map((alert, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    alert.type === "error" ? "text-destructive" : 
                    alert.type === "warning" ? "text-warning" : "text-primary"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
