import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try { const res = await axios.get('/api/v1/assets'); setAssets(res.data || []); } catch (e) { console.error(e); }
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('name', 'Novo Ativo');
    fd.append('type', 'Equipamento');
    fd.append('purchaseDate', new Date().toISOString());
    fd.append('value', '1000');
    fd.append('file', file);
    try { await axios.post('/api/v1/assets', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); setFile(null); load(); } catch (err) { console.error(err); }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Controle de Ativos</h1>
        <form onSubmit={submit} className="mb-6">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="ml-3 px-3 py-1 bg-indigo-600 text-white rounded">Adicionar Ativo</button>
        </form>
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Inventário</h2>
          <ul className="space-y-2 text-sm">
            {assets.map(a => (
              <li key={a.id} className="border-b py-2">{a.name} — {a.type} — R$ {a.value || '—'}</li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
