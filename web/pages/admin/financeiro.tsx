import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function FinanceiroPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Financeiro</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">Resumo financeiro (placeholder)</div>
        <div className="bg-white shadow rounded p-4">Filtros e histórico (placeholder)</div>
      </div>
    </DashboardLayout>
  );
}
