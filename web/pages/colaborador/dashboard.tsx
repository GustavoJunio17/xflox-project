import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function ColaboradorDashboard() {
  const [goals, setGoals] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [gRes, rRes] = await Promise.all([axios.get('/api/v1/goals'), axios.get('/api/v1/ranking')]);
        setGoals(gRes.data);
        setRanking(rRes.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Painel do Colaborador</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Minhas Metas</h2>
          {goals.map((g: any) => (
            <div key={g.id} className="border rounded p-3 my-2">
              <div className="font-semibold">{g.title}</div>
              <div className="text-sm text-gray-600">{g.description}</div>
              <div className="text-xs text-gray-500 mt-1">Vencimento: {g.dueDate}</div>
            </div>
          ))}
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Ranking (Top 10)</h2>
          <ol className="space-y-2">
            {ranking.map((r: any, idx: number) => (
              <li key={r.userId} className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{r.user?.name || r.userId}</div>
                  <div className="text-xs text-gray-500">#{idx + 1}</div>
                </div>
                <div className="text-orange-500 font-bold">{r.total} pts</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
