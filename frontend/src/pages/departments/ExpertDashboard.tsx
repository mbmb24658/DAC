import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";

export default function ExpertDashboard() {
  const { name } = useParams<{ name: string }>();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">داشبورد کارشناس</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>کارشناس: {name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>این صفحه مخصوص نمایش اطلاعات کارشناس {name} است.</p>
          <p className="text-muted-foreground mt-2">
            در اینجا می‌توانید درخواست‌ها، KPIها و گزارشات مربوط به این کارشناس را مشاهده کنید.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}