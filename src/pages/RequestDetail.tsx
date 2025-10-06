import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RequestDetail() {
  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Back Button */}
        <Link to="/requests">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Requests
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground font-mono">
                PBS-9922003
              </h1>
              <Badge>In Progress</Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Industrial procurement request with 3 items
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        {/* Key Details Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Amount</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    15,000 USD
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ 630,000,000 IRR
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-secondary/10 p-2">
                  <User className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requester</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    Ali Reza
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Engineering Dept.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-accent/10 p-2">
                  <Building className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Circle</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    بسپاران
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Industrial
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-warning/10 p-2">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated ETA</p>
                  <p className="text-xl font-bold text-foreground mt-1">
                    Apr 20, 2024
                  </p>
                  <p className="text-xs text-warning mt-1">
                    18 days remaining
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Request Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  stage: "Request Created",
                  date: "2024-03-15",
                  duration: "-",
                  status: "completed",
                },
                {
                  stage: "MRS Issued",
                  date: "2024-03-18",
                  duration: "3 days",
                  status: "completed",
                },
                {
                  stage: "Entered Purchase Circle",
                  date: "2024-03-20",
                  duration: "2 days",
                  status: "completed",
                },
                {
                  stage: "Sourcing & Evaluation",
                  date: "In Progress",
                  duration: "12 days elapsed",
                  status: "current",
                },
                {
                  stage: "Order Placement",
                  date: "Estimated: 2024-04-10",
                  duration: "~5 days",
                  status: "pending",
                },
                {
                  stage: "Completion",
                  date: "Estimated: 2024-04-20",
                  duration: "~10 days",
                  status: "pending",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      item.status === "completed"
                        ? "bg-success text-success-foreground"
                        : item.status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status === "completed" ? "✓" : idx + 1}
                  </div>
                  <div className="flex-1 pb-6 border-l-2 border-border pl-4 -ml-4 last:border-l-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{item.stage}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                      </div>
                      <Badge variant={item.status === "current" ? "default" : "secondary"}>
                        {item.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Conversion Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Currency Conversion Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Order Amount (USD)</span>
                <span className="text-sm font-semibold text-foreground">15,000.00</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Exchange Rate (2024)</span>
                <span className="text-sm font-semibold text-foreground">1 USD = 42,000 IRR</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Ancillary Costs</span>
                <span className="text-sm font-semibold text-foreground">250,000 IRR</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-foreground">Total Cost (IRR)</span>
                <span className="text-lg font-bold text-primary">630,250,000 IRR</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
