import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function AuditLogsPage(){
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await axios.get('/api/v1/audit-logs'); setLogs(res.data||[]); }catch(e){ console.error(e); }
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Logs de Auditoria</h1>
        <div className="bg-white shadow rounded p-4">
          {logs.length===0 ? <div className="text-sm text-gray-500">Nenhum log disponível ou endpoint não implementado.</div> : (
            <ul className="space-y-2 text-sm">{logs.map(l=> <li key={l.id}>{l.action} — {l.userId} — {new Date(l.createdAt).toLocaleString()}</li>)}</ul>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
