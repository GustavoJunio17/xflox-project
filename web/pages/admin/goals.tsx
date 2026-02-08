import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function GoalsPage(){
  const [goals, setGoals] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await axios.get('/api/v1/goals'); setGoals(res.data||[]); }catch(e){console.error(e);} }

  async function create(e: React.FormEvent){ e.preventDefault(); try{ await axios.post('/api/v1/goals', { title, targetDate: new Date().toISOString() }); setTitle(''); load(); }catch(e){console.error(e);} }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Metas e Objetivos</h1>
        <form onSubmit={create} className="mb-4">
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Título da meta" className="border p-2 rounded mr-2" />
          <button className="px-3 py-1 bg-indigo-600 text-white rounded">Criar</button>
        </form>
        <div className="bg-white shadow rounded p-4">
          <ul className="space-y-2">
            {goals.map(g=> <li key={g.id} className="border-b py-2">{g.title} — {g.target}</li>)}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
