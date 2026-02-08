import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CashflowChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Entradas',
        data: data.inflows,
        borderColor: 'rgba(34,197,94,1)',
        backgroundColor: 'rgba(34,197,94,0.2)',
      },
      {
        label: 'Saídas',
        data: data.outflows,
        borderColor: 'rgba(239,68,68,1)',
        backgroundColor: 'rgba(239,68,68,0.2)',
      },
    ],
  };

  return <Line data={chartData} />;
}
