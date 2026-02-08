import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CashflowChart from '../../components/CashflowChart';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

export default function AdminDashboard() {
  const [chartData, setChartData] = useState({ labels: [], inflows: [], outflows: [] });
  const [tasksSummary, setTasksSummary] = useState({ pending: 0, dueSoon: 0 });

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setChartData(res.data.cashflow);
        setTasksSummary(res.data.tasks);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Receita Mensal" value="R$ 75.000" subtitle="+12.5% vs mês anterior" accent="text-green-600" />
        <StatCard title="Despesas" value="R$ 53.500" subtitle="+4.2% vs mês anterior" accent="text-red-600" />
        <StatCard title="Tarefas Concluídas" value="24" subtitle="8 esta semana" />
        <StatCard title="Colaboradores" value="5" subtitle="4 setores ativos" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Fluxo de Caixa</h2>
          <div style={{ height: 300 }}>
            <CashflowChart data={chartData} />
          </div>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Atividade Recente</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li>Ana Silva concluiu "Redesign landing page" — Há 2h</li>
            <li>Pagamento recebido: Consultoria Projeto X — Há 4h</li>
            <li>Carlos Mendes atualizou "Relatório mensal" — Há 5h</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
