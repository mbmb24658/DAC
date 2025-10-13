export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Test 1: Direct Tailwind Classes */}
        <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">تست مستقیم Tailwind</h1>
          <p className="mt-2">اگر این باکس قرمز باشد، Tailwind کار می‌کند</p>
        </div>

        {/* Test 2: CSS Variables */}
        <div 
          className="p-6 rounded-lg border shadow-sm"
          style={{
            backgroundColor: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            borderColor: 'hsl(var(--border))'
          }}
        >
          <h2 className="text-xl font-semibold">تست CSS Variables</h2>
          <p>اگر این باکس استایل دارد، CSS variables کار می‌کنند</p>
        </div>

        {/* Test 3: Button with inline styles */}
        <button 
          className="px-4 py-2 rounded-md font-medium transition-colors"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          }}
        >
          دکمه با استایل اینلاین
        </button>

        {/* Test 4: Manual color test */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[hsl(221_83%_53%)] text-white rounded">Primary Manual</div>
          <div className="p-4 bg-[hsl(262_83%_58%)] text-white rounded">Accent Manual</div>
        </div>
      </div>
    </div>
  );
}