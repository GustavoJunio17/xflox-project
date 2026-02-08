import React from 'react'

type Props = {
  title: string
  value: string
  subtitle?: string
  accent?: string
}

export default function StatCard({ title, value, subtitle, accent = 'text-slate-700' }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className={`text-2xl font-bold ${accent}`}>{value}</div>
          {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
        </div>
        <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-700">{value}</div>
      </div>
    </div>
  )
}
