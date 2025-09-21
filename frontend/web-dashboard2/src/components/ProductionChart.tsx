// src/components/ProductionChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Producao } from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartProps {
  data: Producao[];
}

export const ProductionChart: React.FC<ChartProps> = React.memo(({ data }) => {
  const municipiosAgrupados = data.reduce((acc, item) => {
    const municipio = item.municipio;
    if (acc[municipio]) {
      acc[municipio] += item.producao_toneladas;
    } else {
      acc[municipio] = item.producao_toneladas;
    }
    return acc;
  }, {} as Record<string, number>);

  const top10Data = Object.entries(municipiosAgrupados)
    .map(([municipio, producao]) => ({ municipio, producao_toneladas: producao }))
    .sort((a, b) => b.producao_toneladas - a.producao_toneladas)
    .slice(0, 10);

  const chartData = {
    labels: top10Data.map(item => item.municipio),
    datasets: [
      {
        label: 'Produção em Toneladas',
        data: top10Data.map(item => item.producao_toneladas),
        backgroundColor: 'rgba(236, 106, 8, 1)'
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Top 10 Municípios Produtores', color: '#ffffffff', font: { size: 18 } },
    },
  };

  return <Bar options={options} data={chartData} />;
});