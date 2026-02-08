import Link from 'next/link';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed">
      <div className="p-6 border-b border-slate-800">
        <div className="text-xl font-bold">XFlow</div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/admin/dashboard" className="flex items-center px-3 py-2 rounded hover:bg-slate-800">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/financeiro" className="flex items-center px-3 py-2 rounded hover:bg-slate-800">Financeiro</Link>
          </li>
          <li>
            <Link href="/admin/tarefas" className="flex items-center px-3 py-2 rounded hover:bg-slate-800">Tarefas</Link>
          </li>
          <li>
            <Link href="/admin/ranking" className="flex items-center px-3 py-2 rounded hover:bg-slate-800">Ranking</Link>
          </li>
          <li>
            <Link href="/admin/configuracoes" className="flex items-center px-3 py-2 rounded hover:bg-slate-800">Configurações</Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => logout()}
          className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
