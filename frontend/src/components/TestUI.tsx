import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestUI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">UI Test Component</h1>
          <p className="text-gray-600">Testing shadcn/ui components with Tailwind CSS</p>
        </div>
        
        {/* Buttons Section */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Buttons
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📝 Form Elements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input" className="text-sm font-medium">Text Input</Label>
              <Input id="test-input" placeholder="Type something..." className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Cards Demo */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🃏 Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Info Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700">This is a sample info card with custom colors.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Success Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">This card indicates successful operations.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Test Card from your original */}
        <Card className="shadow-elegant w-96 mx-auto">
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-input">Test Input</Label>
              <Input id="test-input" placeholder="Type something..." />
            </div>
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}