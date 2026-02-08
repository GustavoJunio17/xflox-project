import Head from 'next/head'
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
      </main>
    </Layout>
  )
}
