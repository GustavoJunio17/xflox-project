import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/tarefas', label: 'Tarefas', icon: '✅' },
  { href: '/admin/financeiro', label: 'Financeiro', icon: '💰' },
  { href: '/admin/documentos', label: 'Documentos', icon: '📄' },
  { href: '/admin/patrimonio', label: 'Patrimônio', icon: '🏢' },
  { href: '/admin/arquivos', label: 'Arquivos', icon: '📁' },
  { href: '/admin/metas', label: 'Metas', icon: '🎯' },
  { href: '/admin/ranking', label: 'Ranking', icon: '🏆' },
];

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed">
      <div className="p-6 border-b border-slate-800">
        <div className="text-xl font-bold">🚀 XFlow</div>
        <div className="text-xs text-slate-400 mt-1">Sistema Integrado</div>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  router.pathname === item.href 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2 justify-center px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors"
        >
          🚪 Sair
        </button>
      </div>
    </aside>
  );
}
