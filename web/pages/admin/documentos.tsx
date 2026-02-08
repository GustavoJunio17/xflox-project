import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const templates = [
  { id: 1, name: 'Termo de Responsabilidade', category: 'RH' },
  { id: 2, name: 'Contrato de Prestacao de Servicos', category: 'Juridico' },
  { id: 3, name: 'Termo de Confidencialidade', category: 'RH' },
  { id: 4, name: 'Autorizacao de Uso de Imagem', category: 'Marketing' },
  { id: 5, name: 'Recibo de Entrega de Equipamento', category: 'TI' },
];

export default function Documentos() {
  const { token } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [form, setForm] = useState({ nome: '', cpf: '', data: '', cargo: '' });

  if (!token) return null;

  const generateDoc = () => {
    alert(`Documento "${selectedTemplate?.name}" gerado para ${form.nome}!\nEm producao, isso geraria um PDF e enviaria para assinatura.`);
    setShowModal(false);
    setForm({ nome: '', cpf: '', data: '', cargo: '' });
  };

  return (
    <DashboardLayout>
      <Head><title>XFlow - Documentos</title></Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Documentos e Termos</h1>
        <p className="text-sm text-gray-500">Banco de modelos e gerador automatico</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Modelos Disponiveis</h2>
            <div className="grid gap-3">
              {templates.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium">{t.name}</h3>
                    <span className="text-xs text-gray-500">{t.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedTemplate(t); setShowModal(true); }} className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600">
                      Gerar
                    </button>
                    <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
                      Visualizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">Assinatura Digital</h2>
            <p className="text-sm text-gray-500 mb-3">Envie documentos para assinatura eletronica</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Enviar para Assinatura
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Upload de Arquivo</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" className="hidden" id="fileUpload" />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="text-gray-400 mb-2">Arraste arquivos ou clique aqui</div>
                <span className="text-xs text-gray-400">PDF, DOC, DOCX (max 10MB)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Gerar: {selectedTemplate?.name}</h2>
            <input placeholder="Nome completo" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <input placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <input placeholder="Cargo" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} className="w-full border rounded p-2 mb-3" />
            <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className="w-full border rounded p-2 mb-4" />
            <div className="flex gap-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Cancelar</button>
              <button onClick={generateDoc} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Gerar PDF</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
