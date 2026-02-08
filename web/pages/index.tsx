import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { token, user } = useContext(AuthContext);

  if (token && user) {
    return (
      <Layout>
        <Head><title>XFlow - Bem-vindo</title></Head>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Ola, {user.name}!</h1>
            <p className="text-gray-600 mb-6">Voce esta logado no sistema XFlow.</p>
            <Link href="/admin/dashboard" className="block w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Ir para o Dashboard
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head><title>XFlow - Sistema Integrado de Gestao</title></Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl font-bold mb-4">XFlow</h1>
            <p className="text-xl text-indigo-200">Sistema Integrado de Gestao Empresarial</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition">
              <div className="text-3xl mb-3">Tarefas</div>
              <p className="text-sm text-indigo-200">Gestao de tarefas com timer e gamificacao</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition">
              <div className="text-3xl mb-3">Financeiro</div>
              <p className="text-sm text-indigo-200">Fluxo de caixa, pagamentos e alertas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition">
              <div className="text-3xl mb-3">Documentos</div>
              <p className="text-sm text-indigo-200">Termos, contratos e assinatura digital</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition">
              <div className="text-3xl mb-3">Patrimonio</div>
              <p className="text-sm text-indigo-200">Controle de ativos e equipamentos</p>
            </div>
          </div>
          <div className="text-center">
            <Link href="/login" className="inline-block px-8 py-4 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-100 transition shadow-lg">
              Entrar no Sistema
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
