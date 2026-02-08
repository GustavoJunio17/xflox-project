import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const API_URL = 'http://localhost:3001';

export default function Ranking() {
  const { token } = useContext(AuthContext);
  const [ranking, setRanking] = useState<any[]>([]);
  const [myPoints, setMyPoints] = useState(0);

  useEffect(() => {
    if (token) {
      fetchRanking();
      fetchMyPoints();
    }
  }, [token]);

  const fetchRanking = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/ranking`, { headers: { Authorization: `Bearer ${token}` } });
      setRanking(res.data);
    } catch { 
      setRanking([
        { position: 1, name: 'Maria Silva', sector: 'Operacional', points: 1250, tasksCompleted: 45 },
        { position: 2, name: 'Joao Santos', sector: 'TI', points: 1100, tasksCompleted: 38 },
        { position: 3, name: 'Ana Costa', sector: 'Financeiro', points: 980, tasksCompleted: 35 },
        { position: 4, name: 'Carlos Lima', sector: 'RH', points: 850, tasksCompleted: 30 },
        { position: 5, name: 'Paula Oliveira', sector: 'Comercial', points: 720, tasksCompleted: 25 },
      ]);
    }
  };

  const fetchMyPoints = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/points/me`, { headers: { Authorization: `Bearer ${token}` } });
      setMyPoints(res.data.total || 0);
    } catch { setMyPoints(850); }
  };

  if (!token) return null;

  const getMedal = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return pos.toString();
  };

  return (
    <DashboardLayout>
      <Head><title>XFlow - Ranking</title></Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ranking & Gamificacao</h1>
        <p className="text-sm text-gray-500">Sistema de pontos e recompensas (Estalecas)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <h2 className="text-xl font-bold text-white">Top 10 - Ranking Geral</h2>
              <p className="text-indigo-200 text-sm">Baseado em tarefas concluidas no mes</p>
            </div>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Colaborador</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Setor</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Tarefas</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Estalecas</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ranking.map((r, i) => (
                  <tr key={i} className={i < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 text-xl">{getMedal(r.position || i + 1)}</td>
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.sector}</td>
                    <td className="px-4 py-3 text-center">{r.tasksCompleted}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{r.points} ⭐</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Suas Estalecas</h3>
            <div className="text-4xl font-bold">{myPoints} ⭐</div>
            <p className="text-yellow-100 text-sm mt-2">Voce esta na 4a posicao!</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-3">Como ganhar pontos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Completar tarefa: +10 pts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Antes do prazo: +5 pts bonus
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Tarefa urgente: +15 pts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Meta batida: +50 pts
              </li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold mb-3">Recompensas</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Day Off</span>
                <span className="text-indigo-600 font-bold">500 ⭐</span>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Vale Presente R$50</span>
                <span className="text-indigo-600 font-bold">1000 ⭐</span>
              </div>
              <div className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">Bonus no Salario</span>
                <span className="text-indigo-600 font-bold">2000 ⭐</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Trocar Pontos
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
