import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Next Template</title>
      </Head>

      <main className="p-8">
        <h1 className="text-3xl font-bold">Template Next.js</h1>
        <p className="mt-4 text-gray-700">Um ponto de partida com TypeScript, ESLint e Tailwind.</p>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Dashboards</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="text-blue-600 hover:underline">Dashboard Administrativo</Link>
            </li>
            <li>
              <Link href="/colaborador/dashboard" className="text-blue-600 hover:underline">Painel do Colaborador</Link>
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  )
}
