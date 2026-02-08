import React from 'react';

type Props = { title: string; value: string; subtitle?: string; accent?: string };

export default function StatCard({ title, value, subtitle, accent }: Props) {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`text-2xl font-bold ${accent || 'text-gray-900'}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
