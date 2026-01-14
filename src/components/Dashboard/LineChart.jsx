import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ 
  data, 
  title, 
  yAxisLabel, 
  color = '#3b82f6',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  minY,
  maxY,
  showLegend = false 
}) => {
  const chartData = {
    labels: data.map(d => d.label || d.timestamp),
    datasets: [
      {
        label: title,
        data: data.map(d => d.value),
        borderColor: color,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
        labels: {
          color: '#e2e8f0',
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#f1f5f9',
        font: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif",
        },
        padding: {
          bottom: 15,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          weight: '600',
        },
        displayColors: true,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          maxRotation: 0,
          maxTicksLimit: 6,
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        display: true,
        min: minY,
        max: maxY,
        grid: {
          color: 'rgba(148, 163, 184, 0.08)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: '#94a3b8',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="line-chart-wrapper" style={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
