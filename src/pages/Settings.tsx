import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Users, Bell, Database } from "lucide-react";

export default function Settings() {
  return (
    <Layout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure system preferences and defaults
          </p>
        </div>

        {/* General Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Default Language</Label>
                <p className="text-sm text-muted-foreground">
                  Set the default language for the interface
                </p>
              </div>
              <select className="rounded-md border border-input bg-background px-3 py-2">
                <option>English</option>
                <option>Persian (فارسی)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Working Hours Per Day</Label>
                <p className="text-sm text-muted-foreground">
                  Used for FTE calculations
                </p>
              </div>
              <Input type="number" defaultValue="8" className="w-24" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Auto-save Filters</Label>
                <p className="text-sm text-muted-foreground">
                  Remember filter selections across sessions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Ingestion Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Data Ingestion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Polling Frequency (minutes)</Label>
                <p className="text-sm text-muted-foreground">
                  How often to check for new files
                </p>
              </div>
              <Input type="number" defaultValue="20" className="w-24" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Error Threshold (%)</Label>
                <p className="text-sm text-muted-foreground">
                  Alert if failed rows exceed this percentage
                </p>
              </div>
              <Input type="number" defaultValue="5" className="w-24" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic Retry</Label>
                <p className="text-sm text-muted-foreground">
                  Retry failed ingestions automatically
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send email alerts for critical events
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Alert Email Address</Label>
                <p className="text-sm text-muted-foreground">
                  Where to send system alerts
                </p>
              </div>
              <Input
                type="email"
                placeholder="admin@example.com"
                className="w-64"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">DQ Queue Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when data quality issues are detected
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage users and role assignments for the procurement system. Available
              roles: Admin, Manager, Analyst, Buyer, Auditor.
            </p>
            <Button variant="outline">Manage Users & Roles</Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </Layout>
  );
}
