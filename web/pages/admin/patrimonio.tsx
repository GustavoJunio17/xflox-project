import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const API_URL = 'http://localhost:3001';

export default function Patrimonio() {
  const { token } = useContext(AuthContext);
  const [assets, setAssets] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', category: '', purchaseDate: '', value: '', location: '', status: 'ACTIVE', notes: '' });

  useEffect(() => {
    if (token) fetchAssets();
  }, [token]);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/assets`, { headers: { Authorization: `Bearer ${token}` } });
      setAssets(res.data);
    } catch { setAssets([]); }
  };

  const createAsset = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/assets`, { ...form, value: parseFloat(form.value) }, { headers: { Authorization: `Bearer ${token}` } });
      setShowModal(false);
      setForm({ name: '', code: '', category: '', purchaseDate: '', value: '', location: '', status: 'ACTIVE', notes: '' });
      fetchAssets();
    } catch (e) { alert('Erro ao criar ativo'); }
  };

  if (!token) return null;

  const statusColors: any = { ACTIVE: 'bg-green-100 text-green-800', MAINTENANCE: 'bg-yellow-100 text-yellow-800', INACTIVE: 'bg-red-100 text-red-800' };

  return (
    <DashboardLayout>
      <Head><title>XFlow - Patrimonio</title></Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Controle de Patrimonio</h1>
          <p className="text-sm text-gray-500">Gestao de ativos e equipamentos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          + Novo Ativo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-indigo-600">{assets.length}</div>
          <div className="text-sm text-gray-500">Total de Ativos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{assets.filter(a => a.status === 'ACTIVE').length}</div>
          <div className="text-sm text-gray-500">Ativos</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{assets.filter(a => a.status === 'MAINTENANCE').length}</div>
          <div className="text-sm text-gray-500">Em Manutencao</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">
            R$ {assets.reduce((acc, a) => acc + (a.value || 0), 0).toLocaleString('pt-BR')}
          </div>
          <div className="text-sm text-gray-500">Valor Total</div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Codigo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acoes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{a.code}</td>
                <td className="px-4 py-3 text-sm font-medium">{a.name}</td>
                <td className="px-4 py-3 text-sm">{a.category}</td>
                <td className="px-4 py-3 text-sm">{a.location}</td>
                <td className="px-4 py-3 text-sm">R$ {a.value?.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm mr-2">Editar</button>
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Foto</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo Ativo</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nome *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="col-span-2 border rounded p-2" />
              <input placeholder="Codigo (patrimonio)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="border rounded p-2" />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded p-2">
                <option value="">Categoria</option>
                <option value="Informatica">Informatica</option>
                <option value="Moveis">Moveis</option>
                <option value="Veiculos">Veiculos</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Laboratorio">Laboratorio</option>
              </select>
              <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} className="border rounded p-2" placeholder="Data compra" />
              <input type="number" placeholder="Valor (R$)" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="border rounded p-2" />
              <input placeholder="Localizacao" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="border rounded p-2" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="border rounded p-2">
                <option value="ACTIVE">Ativo</option>
                <option value="MAINTENANCE">Em Manutencao</option>
                <option value="INACTIVE">Inativo</option>
              </select>
              <textarea placeholder="Observacoes / Dados tecnicos" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="col-span-2 border rounded p-2 h-20" />
              <div className="col-span-2 border-2 border-dashed rounded p-4 text-center">
                <input type="file" className="hidden" id="assetPhoto" accept="image/*" />
                <label htmlFor="assetPhoto" className="cursor-pointer text-gray-500">
                  Clique para adicionar foto do ativo
                </label>
              </div>
              <div className="col-span-2 border-2 border-dashed rounded p-4 text-center">
                <input type="file" className="hidden" id="assetNF" accept=".pdf,image/*" />
                <label htmlFor="assetNF" className="cursor-pointer text-gray-500">
                  Clique para anexar Nota Fiscal
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={createAsset} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
