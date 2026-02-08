import React from 'react';
import Sidebar from './Sidebar';

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <header className="h-16 bg-white border-b flex items-center px-6">
          <div className="flex-1">&nbsp;</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">Olá, Admin</div>
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">AS</div>
          </div>
        </header>
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
