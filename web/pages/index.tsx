import Head from 'next/head'
import Link from 'next/link'
import { useContext } from 'react'
import Layout from '../components/Layout'
import { AuthContext } from '../context/AuthContext'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'

export default function Home() {
  const { token } = useContext(AuthContext)

  if (!token) {
    return (
      <Layout>
        <Head>
          <title>XFlow — Bem-vindo</title>
        </Head>
        <main className="p-8 text-center">
          <h1 className="text-4xl font-bold">Bem-vindo ao XFlow</h1>
          <p className="mt-4 text-gray-700">Gerencie tarefas, finanças e metas da sua equipe.</p>
          <div className="mt-8">
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">Entrar</Link>
          </div>
          <div className="mt-10 text-sm text-gray-500">
            Use as credenciais de demo: admin@example.com / senha123
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>XFlow — Home</title>
      </Head>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <p className="text-sm text-gray-600">Resumo rápido das suas responsabilidades e alertas</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Tarefas Pendentes" value="12" subtitle="3 atrasadas" accent="text-yellow-600" />
        <StatCard title="Alertas de Pagamento" value="5" subtitle="2 vencendo em 3 dias" accent="text-red-600" />
        <StatCard title="Posição no Ranking" value="#4" subtitle="Top 10 do mês" />
        <StatCard title="Metas Ativas" value="3" subtitle="1 quase alcançada" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Fluxo de Caixa (Resumo)</h2>
          <div className="h-48 bg-gray-50 flex items-center justify-center text-sm text-gray-400">Gráfico de entradas vs saídas (a implementar)</div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Ações Rápidas</h2>
          <ul className="space-y-2">
            <li><Link href="/admin/financeiro" className="text-blue-600">Ver Financeiro</Link></li>
            <li><Link href="/admin/tarefas" className="text-blue-600">Minhas Tarefas</Link></li>
            <li><Link href="/admin/ranking" className="text-blue-600">Ranking</Link></li>
            <li><Link href="/admin/configuracoes" className="text-blue-600">Configurações</Link></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
