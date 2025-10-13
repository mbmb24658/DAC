import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useParams } from "react-router-dom";

interface HistoryItem {
  at: string;
  field: string;
  old: string;
  new: string;
}

interface RequestData {
  request: {
    request_number: string;
    purchase_department: string;
    purchase_expert: string;
    latest_status: string;
    initial_amount?: number;
    first_item_description?: string;
  };
  history: HistoryItem[];
}

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RequestData | null>(null);

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    const res = await api.get(`/requests/${id}`);
    setData(res.data);
  };

  if (!data) return <div>Loading...</div>;

  const r = data.request;
  const history = data.history || [];

  return (
    <div>
      <h2>جزئیات: {r.request_number}</h2>
      <p>دایره: {r.purchase_department}</p>
      <p>کارشناس: {r.purchase_expert}</p>
      <p>مبلغ اولیه: {r.initial_amount}</p>
      <h3>شرح آیتم اول</h3>
      <p>{r.first_item_description}</p>
      <h3>تاریخچه تغییرات</h3>
      <ul>
        {history.map((h, idx) => (
          <li key={idx}>{h.at} - {h.field} : {h.old} → {h.new}</li>
        ))}
      </ul>
    </div>
  );
}