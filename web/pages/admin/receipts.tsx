import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function ReceiptsPage() {
  const [file, setFile] = useState<File | null>(null);

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('amount', '10.00');
    fd.append('dueDate', new Date().toISOString());
    fd.append('category', 'Receipts');
    try { await axios.post('/api/v1/payments', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setFile(null); alert('Enviado'); } catch (err) { console.error(err); alert('Erro'); }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Central de Comprovantes</h1>
        <form onSubmit={submit} className="p-4 bg-white rounded shadow max-w-md">
          <input type="file" accept="image/*,application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded">Enviar Comprovante</button>
        </form>
      </DashboardLayout>
    </AuthGuard>
  );
}
