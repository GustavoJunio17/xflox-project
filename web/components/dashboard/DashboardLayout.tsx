import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import Avatar from '../ui/Avatar';
import { AuthContext } from '../../context/AuthContext';

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
  const { token } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <div className="flex-1">
            <div className="text-sm text-slate-500">Painel</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">{token ? 'Olá, usuário' : ''}</div>
            <Avatar name={token ? 'Usuário Demo' : 'US'} size={36} />
          </div>
        </header>
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
