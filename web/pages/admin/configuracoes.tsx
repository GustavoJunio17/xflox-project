import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function ConfiguracoesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">Setores e permissões (placeholder)</div>
        <div className="bg-white shadow rounded p-4">Equipe (placeholder)</div>
      </div>
    </DashboardLayout>
  );
}
