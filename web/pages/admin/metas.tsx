import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const API_URL = 'http://localhost:3001';

export default function Metas() {
  const { token } = useContext(AuthContext);
  const [goals, setGoals] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', target: '', current: '0', deadline: '', type: 'INDIVIDUAL' });

  useEffect(() => {
    if (token) fetchGoals();
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/goals`, { headers: { Authorization: `Bearer ${token}` } });
      setGoals(res.data);
    } catch {
      setGoals([
        { id: 1, title: 'Concluir 50 tarefas', target: 50, current: 35, deadline: '2025-03-31', type: 'INDIVIDUAL' },
        { id: 2, title: 'Reduzir custos em 10%', target: 10, current: 7, deadline: '2025-06-30', type: 'SECTOR' },
        { id: 3, title: 'Digitalizar 100 documentos', target: 100, current: 100, deadline: '2025-02-28', type: 'TEAM' },
      ]);
    }
  };

  const createGoal = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/goals`, { ...form, target: parseInt(form.target), current: parseInt(form.current) }, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      setForm({ title: '', description: '', target: '', current: '0', deadline: '', type: 'INDIVIDUAL' });
      fetchGoals();
    } catch { alert('Erro ao criar meta'); }
  };

  if (!token) return null;

  const getProgress = (g: any) => Math.min(100, Math.round((g.current / g.target) * 100));
  const getProgressColor = (p: number) => p >= 100 ? 'bg-green-500' : p >= 70 ? 'bg-blue-500' : p >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <DashboardLayout>
      <Head><title>XFlow - Metas</title></Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Metas e Objetivos</h1>
          <p className="text-sm text-gray-500">Acompanhe o progresso das metas</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          + Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-indigo-600">{goals.length}</div>
          <div className="text-sm text-gray-500">Total de Metas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{goals.filter(g => getProgress(g) >= 100).length}</div>
          <div className="text-sm text-gray-500">Metas Concluidas</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{goals.filter(g => getProgress(g) < 100).length}</div>
          <div className="text-sm text-gray-500">Em Progresso</div>
        </div>
      </div>

      <div className="grid gap-4">
        {goals.map(g => {
          const progress = getProgress(g);
          return (
            <div key={g.id} className="bg-white shadow rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{g.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${g.type === 'INDIVIDUAL' ? 'bg-blue-100 text-blue-800' : g.type === 'SECTOR' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {g.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{progress}%</div>
                  <div className="text-xs text-gray-500">Prazo: {new Date(g.deadline).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className={`h-full ${getProgressColor(progress)} transition-all`} style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Atual: {g.current}</span>
                <span>Meta: {g.target}</span>
              </div>
              {progress >= 100 && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm text-center">
                  Meta concluida! +50 Estalecas
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Meta</h2>
            <input placeholder="Titulo da meta *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <textarea placeholder="Descricao" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2 mb-3 h-20" />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="number" placeholder="Meta (numero)" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="border rounded p-2" />
              <input type="number" placeholder="Atual" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} className="border rounded p-2" />
            </div>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded p-2 mb-4">
              <option value="INDIVIDUAL">Individual</option>
              <option value="SECTOR">Setor</option>
              <option value="TEAM">Equipe</option>
              <option value="COMPANY">Empresa</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={createGoal} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Criar Meta</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
