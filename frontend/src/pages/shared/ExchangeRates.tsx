import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, TrendingUp } from "lucide-react";

const exchangeRates = [
  { currency: "USD", year: 2024, rate: 42000, updatedBy: "Admin", updatedAt: "2024-03-15" },
  { currency: "EUR", year: 2024, rate: 45500, updatedBy: "Admin", updatedAt: "2024-03-15" },
  { currency: "GBP", year: 2024, rate: 53000, updatedBy: "Admin", updatedAt: "2024-03-15" },
  { currency: "USD", year: 2023, rate: 38000, updatedBy: "Admin", updatedAt: "2023-12-20" },
  { currency: "EUR", year: 2023, rate: 41000, updatedBy: "Admin", updatedAt: "2023-12-20" },
];

export default function ExchangeRates() {
  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Exchange Rates</h1>
            <p className="text-muted-foreground mt-1">
              Manage currency conversion rates for procurement calculations
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Rate
          </Button>
        </div>

        {/* Info Card */}
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Currency Conversion Priority
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The system uses exchange rates based on order date year, falling back to
                  MRS date, then request date. If no rate exists for the year, it uses the
                  latest prior year rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rates Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Exchange Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Currency
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Year
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Rate to IRR
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Updated By
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Last Updated
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exchangeRates.map((rate, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-mono font-semibold text-primary text-lg">
                          {rate.currency}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {rate.year}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {rate.rate.toLocaleString()} IRR
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {rate.updatedBy}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {rate.updatedAt}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Add Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Add Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Currency Code
                </label>
                <Input placeholder="USD" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Year
                </label>
                <Input type="number" placeholder="2024" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Rate to IRR
                </label>
                <Input type="number" placeholder="42000" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Add Rate</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
