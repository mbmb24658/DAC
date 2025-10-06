import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Database,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/hero-analytics.jpg";

const Index = () => {
  const features = [
    {
      icon: Database,
      title: "Automated Data Ingestion",
      description:
        "Seamlessly import Excel files with automatic Persian date conversion and currency normalization.",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description:
        "Real-time KPIs, trend analysis, and predictive ETA calculations for procurement requests.",
    },
    {
      icon: Clock,
      title: "Timeline Tracking",
      description:
        "Complete request lifecycle visibility with stage durations and historical changes.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure multi-role system for managers, buyers, analysts, and auditors.",
    },
    {
      icon: Zap,
      title: "Workforce Planning",
      description:
        "Estimate required FTEs and man-hours to clear procurement backlogs efficiently.",
    },
    {
      icon: BarChart3,
      title: "Exportable Reports",
      description:
        "Generate comprehensive PDF and CSV reports for managerial reviews and audits.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-hero" />
        
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Procurement Chain
              <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
                Data Analyzer
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Production-grade analytics system for ingesting, normalizing, and analyzing
              procurement data with predictive insights and comprehensive reporting.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/sign-in">
                <Button size="lg" className="gap-2 shadow-elegant">
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="lg" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Powerful Features for Procurement Teams
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built to handle complex procurement data with precision, scalability, and ease
              of use.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <Card key={idx} className="shadow-card hover:shadow-elegant transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%+</div>
              <p className="text-sm text-muted-foreground">Request Visibility</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">&lt;1%</div>
              <p className="text-sm text-muted-foreground">Ingestion Error Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">28</div>
              <p className="text-sm text-muted-foreground">Data Fields Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5</div>
              <p className="text-sm text-muted-foreground">User Roles Supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-elegant bg-gradient-card border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Transform Your Procurement Analytics?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start analyzing your procurement data with powerful insights, predictive
                analytics, and comprehensive reporting capabilities.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
