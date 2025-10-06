import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recentJobs = [
  {
    id: "1",
    filename: "DB.xlsx",
    status: "completed",
    totalRows: 1423,
    successRows: 1405,
    failedRows: 18,
    timestamp: "2024-03-28 14:32",
  },
  {
    id: "2",
    filename: "DB2.xlsx",
    status: "completed",
    totalRows: 856,
    successRows: 856,
    failedRows: 0,
    timestamp: "2024-03-28 14:35",
  },
  {
    id: "3",
    filename: "DB_March.xlsx",
    status: "processing",
    totalRows: 234,
    successRows: 180,
    failedRows: 0,
    timestamp: "2024-03-28 15:10",
  },
];

export default function Ingest() {
  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; icon: any }
    > = {
      completed: { variant: "secondary", icon: CheckCircle },
      processing: { variant: "default", icon: Clock },
      failed: { variant: "destructive", icon: AlertCircle },
    };

    const { variant, icon: Icon } = config[status] || config.processing;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Ingestion</h1>
          <p className="text-muted-foreground mt-1">
            Upload and process procurement data files
          </p>
        </div>

        {/* Upload Card */}
        <Card className="shadow-elegant border-2 border-dashed border-primary/30 bg-gradient-hero">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <Upload className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Upload Data Files
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Upload Excel files (DB.xlsx, DB2.xlsx) for processing. The system will
                normalize dates, convert currencies, and track changes automatically.
              </p>
              <Button size="lg" className="gap-2">
                <Upload className="h-5 w-5" />
                Select Files
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: XLSX, CSV • Max size: 50MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expected Files */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                DB.xlsx (Incoming Requests)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sheet:</span>
                <span className="font-medium text-foreground">DataSet1 (2)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected columns:</span>
                <span className="font-medium text-foreground">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last uploaded:</span>
                <span className="font-medium text-foreground">2 hours ago</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-secondary" />
                DB2.xlsx (Purchased Requests)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sheet:</span>
                <span className="font-medium text-foreground">DataSet1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expected columns:</span>
                <span className="font-medium text-foreground">28</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last uploaded:</span>
                <span className="font-medium text-foreground">2 hours ago</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Ingestion Jobs */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Ingestion Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Filename
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Total Rows
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Success
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Failed
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-primary" />
                          {job.filename}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(job.status)}</td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {job.totalRows.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-success font-medium">
                        {job.successRows.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {job.failedRows > 0 ? (
                          <span className="text-destructive font-medium">
                            {job.failedRows}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {job.timestamp}
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
