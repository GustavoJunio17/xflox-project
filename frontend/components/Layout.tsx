import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b py-4 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">Header - Next Template</div>
      </header>
      <div className="max-w-4xl mx-auto">{children}</div>
      <footer className="border-t py-4 px-6 text-sm text-center">© 2026</footer>
    </div>
  )
}
