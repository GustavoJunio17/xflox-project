import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const API_URL = 'http://localhost:3001';

export default function Arquivos() {
  const { token } = useContext(AuthContext);
  const [files, setFiles] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (token) fetchFiles();
  }, [token, currentFolder]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/files?folder=${currentFolder}`, { headers: { Authorization: `Bearer ${token}` } });
      setFiles(res.data);
    } catch {
      setFiles([
        { id: 1, name: 'Comprovantes 2025', type: 'folder', items: 23 },
        { id: 2, name: 'Notas Fiscais', type: 'folder', items: 45 },
        { id: 3, name: 'Contratos', type: 'folder', items: 12 },
        { id: 4, name: 'comprovante_luz_jan.pdf', type: 'file', size: '245 KB', date: '2025-01-15' },
        { id: 5, name: 'nf_fornecedor_001.pdf', type: 'file', size: '1.2 MB', date: '2025-01-20' },
        { id: 6, name: 'recibo_aluguel.jpg', type: 'file', size: '890 KB', date: '2025-01-25' },
      ]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', currentFolder);
    try {
      await axios.post(`${API_URL}/api/v1/files/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      fetchFiles();
    } catch { alert('Erro ao enviar arquivo'); }
    setUploading(false);
  };

  if (!token) return null;

  const folders = [
    { id: 'root', name: 'Raiz', icon: '🏠' },
    { id: 'comprovantes', name: 'Comprovantes', icon: '📄' },
    { id: 'notas', name: 'Notas Fiscais', icon: '🧾' },
    { id: 'contratos', name: 'Contratos', icon: '📝' },
    { id: 'recibos', name: 'Recibos', icon: '🧾' },
  ];

  return (
    <DashboardLayout>
      <Head><title>XFlow - Arquivos</title></Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestao de Arquivos</h1>
        <p className="text-sm text-gray-500">Upload, organizacao e compressao de documentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="font-semibold mb-3">Pastas</h2>
            <nav className="space-y-1">
              {folders.map(f => (
                <button key={f.id} onClick={() => setCurrentFolder(f.id)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${currentFolder === f.id ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
                  <span>{f.icon}</span> {f.name}
                </button>
              ))}
            </nav>
            <hr className="my-4" />
            <button className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded">
              + Nova Pasta
            </button>
          </div>

          <div className="bg-white shadow rounded-lg p-4 mt-4">
            <h2 className="font-semibold mb-3">Armazenamento</h2>
            <div className="text-sm text-gray-500 mb-2">2.5 GB de 10 GB usado</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                <span className="font-medium">{folders.find(f => f.id === currentFolder)?.name || 'Raiz'}</span>
              </div>
              <div className="flex gap-2">
                <label className={`px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 ${uploading ? 'opacity-50' : ''}`}>
                  {uploading ? 'Enviando...' : '📤 Upload'}
                  <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
                <button className="px-4 py-2 border rounded hover:bg-gray-50">
                  📷 Digitalizar
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid gap-2">
                {files.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{f.type === 'folder' ? '📁' : f.name.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs text-gray-500">
                          {f.type === 'folder' ? `${f.items} itens` : `${f.size} • ${f.date}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {f.type === 'folder' ? (
                        <button onClick={() => setCurrentFolder(f.name.toLowerCase().replace(' ', '_'))} className="text-indigo-600 text-sm hover:underline">
                          Abrir
                        </button>
                      ) : (
                        <>
                          <button className="text-indigo-600 text-sm hover:underline">Download</button>
                          <button className="text-blue-600 text-sm hover:underline">Comprimir</button>
                          <button className="text-red-600 text-sm hover:underline">Excluir</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Dica: Compressao Automatica</h3>
            <p className="text-sm text-yellow-700">
              Arquivos de imagem maiores que 1MB sao automaticamente comprimidos para economizar espaco.
              PDFs sao otimizados mantendo a qualidade do texto.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
