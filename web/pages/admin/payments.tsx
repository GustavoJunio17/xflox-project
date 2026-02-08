import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await axios.get('/api/v1/payments');
      setPayments(res.data || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('amount', '100.00');
    fd.append('dueDate', new Date().toISOString());
    fd.append('category', 'Outros');
    fd.append('file', file);
    try {
      await axios.post('/api/v1/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Gestão de Pagamentos</h1>
        <form onSubmit={submit} className="mb-6">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="ml-3 px-3 py-1 bg-indigo-600 text-white rounded">Enviar</button>
        </form>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Últimos Pagamentos</h2>
          <ul className="space-y-2 text-sm">
            {payments.map((p) => (
              <li key={p.id} className="border-b py-2">
                {p.category} — {p.amount} — {new Date(p.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
