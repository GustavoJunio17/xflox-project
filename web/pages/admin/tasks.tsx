import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AuthGuard from '../../components/AuthGuard';
import axios from 'axios';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(()=>{ load(); }, []);
  async function load(){ try{ const res = await axios.get('/api/v1/tasks'); setTasks(res.data||[]); }catch(e){console.error(e);} }

  async function complete(id: string){
    try{ await axios.put(`/api/v1/tasks/${id}`, { status: 'CONCLUIDA', completedAt: new Date().toISOString() }); load(); }catch(e){console.error(e)}
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <h1 className="text-2xl font-bold mb-4">Minhas Tarefas</h1>
        <div className="bg-white shadow rounded p-4">
          <ul className="space-y-3">
            {tasks.map(t=> (
              <li key={t.id} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-gray-500">Venc.: {new Date(t.dueDate).toLocaleDateString()}</div>
                </div>
                <div>
                  {t.status !== 'CONCLUIDA' ? <button onClick={()=>complete(t.id)} className="px-3 py-1 bg-green-600 text-white rounded">Concluir</button> : <span className="text-sm text-green-600">Concluída</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
