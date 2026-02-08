import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CashflowChart from '../../components/CashflowChart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Payment {
  id: string;
  amount: number;
  category: string;
  status: string;
  dueDate: string;
  sector?: { name: string };
}

export default function Financeiro() {
  const { token } = useContext(AuthContext);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cashflow, setCashflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amount: '', category: '', dueDate: '' });

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [paymentsRes, cashflowRes] = await Promise.all([
        axios.get(`${API_URL}/api/v1/payments`),
        axios.get(`${API_URL}/api/v1/finance/cashflow`)
      ]);
      setPayments(paymentsRes.data || []);
      setCashflow(cashflowRes.data?.data);
    } catch (e) {}
    setLoading(false);
  };

  const createPayment = async () => {
    try {
      await axios.post(`${API_URL}/api/v1/payments`, {
        amount: parseFloat(form.amount),
        category: form.category,
        dueDate: form.dueDate
      });
      setShowModal(false);
      setForm({ amount: '', category: '', dueDate: '' });
      fetchData();
    } catch (e) {}
  };

  const markAsPaid = async (id: string) => {
    try {
      await axios.put(`${API_URL}/api/v1/payments/${id}`, { status: 'PAGO' });
      fetchData();
    } catch (e) {}
  };

  const isNearDue = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  };

  const isOverdue = (date: string) => new Date(date).getTime() < Date.now();

  if (!token) return null;

  const pendingPayments = payments.filter(p => p.status === 'PENDENTE');
  const paidPayments = payments.filter(p => p.status === 'PAGO');

  return (
    <DashboardLayout>
      <Head><title>XFlow - Financeiro</title></Head>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestao Financeira</h1>
          <p className="text-sm text-gray-500">Fluxo de caixa e pagamentos</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          + Novo Pagamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Fluxo de Caixa</h2>
          <div className="h-64">
            {cashflow ? <CashflowChart data={cashflow} /> : <div className="h-full flex items-center justify-center text-gray-400">Carregando...</div>}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3">Resumo</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-2 bg-red-50 rounded">
              <span>Pendentes</span>
              <span className="font-bold text-red-600">{pendingPayments.length}</span>
            </div>
            <div className="flex justify-between p-2 bg-green-50 rounded">
              <span>Pagos</span>
              <span className="font-bold text-green-600">{paidPayments.length}</span>
            </div>
            <div className="flex justify-between p-2 bg-yellow-50 rounded">
              <span>Vencendo em 3 dias</span>
              <span className="font-bold text-yellow-600">{pendingPayments.filter(p => isNearDue(p.dueDate)).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Pagamentos Pendentes</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Categoria</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Valor</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Vencimento</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingPayments.map(p => (
                  <tr key={p.id} className={isOverdue(p.dueDate) ? 'bg-red-50' : isNearDue(p.dueDate) ? 'bg-yellow-50' : ''}>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3 font-mono">R$ {p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{new Date(p.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {isOverdue(p.dueDate) ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">VENCIDO</span>
                      ) : isNearDue(p.dueDate) ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">VENCENDO</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">PENDENTE</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => markAsPaid(p.id)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                        Marcar Pago
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-500">Nenhum pagamento pendente</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Pagamento</h2>
            <input type="number" placeholder="Valor" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded p-2 mb-3">
              <option value="">Selecione a categoria</option>
              <option value="Aluguel">Aluguel</option>
              <option value="Energia">Energia</option>
              <option value="Internet">Internet</option>
              <option value="Papelaria">Papelaria</option>
              <option value="Material">Material</option>
              <option value="Outros">Outros</option>
            </select>
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full border rounded p-2 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={createPayment} className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700">Criar</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
