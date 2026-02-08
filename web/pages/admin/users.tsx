import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function UsersPage(){
  const [users, setUsers] = useState<any[]>([]);
  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await axios.get('/api/v1/users'); setUsers(res.data||[]); }catch(e){console.error(e);} }

  async function changeRole(id:string, role:string){ try{ await axios.put(`/api/v1/users/${id}`, { role }); load(); }catch(e){console.error(e);} }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Gestão de Usuários</h1>
        <div className="bg-white shadow rounded p-4">
          <ul className="space-y-2">
            {users.map(u=> (
              <li key={u.id} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{u.name} — {u.email}</div>
                  <div className="text-xs text-gray-500">Setor: {u.sector?.name || '—'}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={()=>changeRole(u.id,'ADMIN')} className="px-2 py-1 bg-indigo-600 text-white rounded">Admin</button>
                  <button onClick={()=>changeRole(u.id,'GESTOR')} className="px-2 py-1 bg-slate-600 text-white rounded">Gestor</button>
                  <button onClick={()=>changeRole(u.id,'COLABORADOR')} className="px-2 py-1 bg-gray-400 text-white rounded">Colab</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
