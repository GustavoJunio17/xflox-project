import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import CashflowChart from '../../components/CashflowChart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [cashflow, setCashflow] = useState<any>(null);
  const [stats, setStats] = useState({ tasks: 0, payments: 0, rank: '-', goals: 0 });

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/api/v1/finance/cashflow`).then(r => setCashflow(r.data.data)).catch(() => {});
    axios.get(`${API_URL}/api/v1/tasks`).then(r => setStats(s => ({ ...s, tasks: r.data?.filter((t: any) => t.status !== 'CONCLUIDA').length || 0 }))).catch(() => {});
    axios.get(`${API_URL}/api/v1/payments`).then(r => {
      const pending = r.data?.filter((p: any) => p.status === 'PENDENTE').length || 0;
      setStats(s => ({ ...s, payments: pending }));
    }).catch(() => {});
    axios.get(`${API_URL}/api/v1/goals`).then(r => setStats(s => ({ ...s, goals: r.data?.length || 0 }))).catch(() => {});
  }, [token]);

  if (!token) return null;

  return (
    <DashboardLayout>
      <Head><title>XFlow — Dashboard</title></Head>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Visão geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Tarefas Pendentes" value={String(stats.tasks)} subtitle="Aguardando execução" accent="text-yellow-600" />
        <StatCard title="Pagamentos Pendentes" value={String(stats.payments)} subtitle="A vencer" accent="text-red-600" />
        <StatCard title="Ranking" value={stats.rank} subtitle="Sua posição" accent="text-indigo-600" />
        <StatCard title="Metas Ativas" value={String(stats.goals)} subtitle="Em andamento" accent="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Fluxo de Caixa</h2>
          <div className="h-64">
            {cashflow ? <CashflowChart data={cashflow} /> : <div className="h-full flex items-center justify-center text-gray-400">Carregando...</div>}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Ações Rápidas</h2>
          <ul className="space-y-3">
            <li><Link href="/admin/tarefas" className="block p-2 bg-indigo-50 rounded hover:bg-indigo-100 text-indigo-700">📋 Minhas Tarefas</Link></li>
            <li><Link href="/admin/financeiro" className="block p-2 bg-green-50 rounded hover:bg-green-100 text-green-700">💰 Financeiro</Link></li>
            <li><Link href="/admin/documentos" className="block p-2 bg-blue-50 rounded hover:bg-blue-100 text-blue-700">📄 Documentos</Link></li>
            <li><Link href="/admin/patrimonio" className="block p-2 bg-orange-50 rounded hover:bg-orange-100 text-orange-700">🏢 Patrimônio</Link></li>
            <li><Link href="/admin/ranking" className="block p-2 bg-purple-50 rounded hover:bg-purple-100 text-purple-700">🏆 Ranking</Link></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
