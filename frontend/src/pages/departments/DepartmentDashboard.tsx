import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface DepartmentSummary {
  total_requests: number;
  avg_initial_amount: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  total_amount: number;
}

interface Request {
  id: string;
  request_number: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  initial_amount: number;
  created_at: string;
  department: string;
}

export default function DepartmentDashboard() {
  const { name } = useParams<{ name: string }>();
  const [summary, setSummary] = useState<DepartmentSummary | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      fetchData();
    }
  }, [name]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchSummary(),
        fetchRequests()
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در دریافت اطلاعات");
      console.error("Error fetching department data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    if (!name) return;
    
    const res = await api.get(`/departments/${encodeURIComponent(name)}/summary`);
    setSummary(res.data);
  };

  const fetchRequests = async () => {
    if (!name) return;
    
    const res = await api.get(`/requests?department=${encodeURIComponent(name)}&limit=50`);
    setRequests(res.data);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'تایید شده';
      case 'pending': return 'در انتظار';
      case 'rejected': return 'رد شده';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              خطا در دریافت اطلاعات
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}>
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">داشبورد دپارتمان</h1>
          <p className="text-muted-foreground mt-2">
            {name} - مدیریت درخواست‌های خرید
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {summary?.total_requests || 0} درخواست
        </Badge>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل درخواست‌ها</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total_requests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">میانگین مبلغ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.avg_initial_amount)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در انتظار بررسی</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.pending_requests}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل مبلغ</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summary.total_amount)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>آخرین درخواست‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              هیچ درخواستی یافت نشد
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusVariant(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {request.request_number} - {request.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(request.initial_amount)} • 
                        {new Date(request.created_at).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/request/${request.id}`}>
                      مشاهده جزئیات
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}