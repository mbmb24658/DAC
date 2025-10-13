import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const mockRequests = [
  {
    id: "1",
    requestNumber: "PBS-9922003",
    requester: "Ali Reza",
    purchaseCircle: "بسپاران",
    status: "In Progress",
    requestDate: "2024-03-15",
    orderAmount: 15000,
    currency: "USD",
    eta: "2024-04-20",
  },
  {
    id: "2",
    requestNumber: "PBS-9922104",
    requester: "Sara Ahmadi",
    purchaseCircle: "صنعتی",
    status: "Completed",
    requestDate: "2024-02-10",
    orderAmount: 8500,
    currency: "EUR",
    eta: "-",
  },
  {
    id: "3",
    requestNumber: "PBS-9923055",
    requester: "Mohammad Karimi",
    purchaseCircle: "بسپاران",
    status: "Flagged",
    requestDate: "2024-03-20",
    orderAmount: 12000,
    currency: "USD",
    eta: "2024-05-01",
  },
];

export default function Requests() {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      "In Progress": "default",
      "Completed": "secondary",
      "Flagged": "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Procurement Requests</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all procurement requests
            </p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by request number, requester..."
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Request #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Requester
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Purchase Circle
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      ETA
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockRequests.map((request) => (
                    <tr key={request.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-medium text-primary">
                          {request.requestNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {request.requester}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {request.purchaseCircle}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        {request.orderAmount.toLocaleString()} {request.currency}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {request.eta}
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/requests/${request.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
