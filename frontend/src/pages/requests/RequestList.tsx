import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";

type Req = {
  id: number;
  request_number: string;
  purchase_department: string;
  purchase_expert: string;
  latest_status: string;
  initial_amount?: number;
};

export default function RequestList() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching requests...");
      
      const res = await api.get("/requests?limit=200");
      console.log("API Response:", res);
      console.log("Response data:", res.data);
      
      // endpoint شما مستقیماً آرایه برمی‌گرداند
      if (Array.isArray(res.data)) {
        setRequests(res.data);
        console.log(`Loaded ${res.data.length} requests`);
      } else {
        console.error("Expected array but got:", typeof res.data, res.data);
        setError("ساختار داده دریافتی نامعتبر است");
        setRequests([]);
      }
    } catch (err: any) {
      console.error("Error fetching requests:", err);
      console.error("Error details:", err.response?.data);
      setError(`خطا در دریافت داده‌ها: ${err.message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/requests?q=${encodeURIComponent(q)}&limit=200`);
      
      if (Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setRequests([]);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError("خطا در جستجو");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>لیست درخواست‌ها</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
          <button onClick={fetchRequests} style={{ marginLeft: '10px' }}>
            تلاش مجدد
          </button>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <input 
          value={q} 
          onChange={e => setQ(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="جستجو شماره درخواست / دایره / کارشناس" 
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={onSearch}>جستجو</button>
        <button onClick={fetchRequests} style={{ marginLeft: '10px' }}>
          بارگذاری مجدد
        </button>
      </div>
      
      {requests.length === 0 && !loading ? (
        <div>هیچ درخواستی یافت نشد</div>
      ) : (
        <div>
          <p>تعداد درخواست‌ها: {requests.length}</p>
          <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>شماره</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>دایره خرید</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>کارشناس</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>وضعیت</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>مبلغ اولیه</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <Link to={`/request/${r.id}`}>{r.request_number}</Link>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <Link to={`/department/${encodeURIComponent(r.purchase_department)}`}>
                      {r.purchase_department}
                    </Link>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <Link to={`/expert/${encodeURIComponent(r.purchase_expert)}`}>
                      {r.purchase_expert}
                    </Link>
                  </td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{r.latest_status}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    {r.initial_amount ? r.initial_amount.toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}