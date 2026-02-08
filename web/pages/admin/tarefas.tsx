import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  sector?: { name: string };
}

export default function Tarefas() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (!token) return;
    fetchTasks();
  }, [token]);

  useEffect(() => {
    let interval: any;
    if (activeTimer) {
      interval = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/tasks`);
      setTasks(res.data || []);
    } catch (e) {}
    setLoading(false);
  };

  const createTask = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/tasks`, form);
      setShowModal(false);
      setForm({ title: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (e) {}
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/api/v1/tasks/${id}`, { status });
      fetchTasks();
      if (status === 'CONCLUIDA' && activeTimer === id) {
        setActiveTimer(null);
        setTimerSeconds(0);
      }
    } catch (e) {}
  };

  const startTimer = (id: string) => {
    setActiveTimer(id);
    setTimerSeconds(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const statusColor = (s: string) => {
    if (s === 'CONCLUIDA') return 'bg-green-100 text-green-800';
    if (s === 'EM_ANDAMENTO') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (!token) return null;

  return (
    <DashboardLayout>
      <Head><title>XFlow - Tarefas</title></Head>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestao de Tarefas</h1>
          <p className="text-sm text-gray-500">Controle de tempo e produtividade</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + Nova Tarefa
        </button>
      </div>

      {activeTimer && (
        <div className="bg-indigo-600 text-white p-4 rounded-lg mb-6 flex justify-between items-center">
          <span>Timer ativo: {tasks.find(t => t.id === activeTimer)?.title}</span>
          <span className="text-2xl font-mono">{formatTime(timerSeconds)}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Carregando...</div>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  <div className="flex gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${statusColor(task.status)}`}>{task.status}</span>
                    {task.sector && <span className="px-2 py-1 bg-gray-100 rounded">{task.sector.name}</span>}
                    <span className="px-2 py-1 bg-gray-100 rounded">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status !== 'CONCLUIDA' && (
                    <>
                      {activeTimer !== task.id ? (
                        <button onClick={() => startTimer(task.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                          Iniciar
                        </button>
                      ) : (
                        <button onClick={() => updateStatus(task.id, 'CONCLUIDA')} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                          Concluir
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <div className="text-center py-10 text-gray-500">Nenhuma tarefa encontrada</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
            <input placeholder="Titulo" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <textarea placeholder="Descricao" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2 mb-3" rows={3} />
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full border rounded p-2 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={createTask} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Criar</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
