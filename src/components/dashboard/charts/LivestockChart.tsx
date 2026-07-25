'use client';

import { useEffect, useRef, useState } from 'react';

export default function LivestockChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [chartJS, setChartJS] = useState<any>(null);

  useEffect(() => {
    // Dynamic import of Chart.js to avoid SSR issues
    async function loadChartJS() {
      try {
        const chartModule = await import('chart.js');
        const { Chart, registerables } = chartModule;
        Chart.register(...registerables);
        setChartJS(Chart);
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
      }
    }
    
    loadChartJS();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !chartJS) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    // Livestock population trends (in millions)
    const cattleData = [64.5, 64.8, 65.0, 65.2, 65.1, 65.0];
    const camelData = [7.1, 7.15, 7.18, 7.22, 7.20, 7.19];
    const goatData = [41.5, 41.8, 42.0, 42.3, 42.1, 42.0];
    const sheepData = [37.8, 38.0, 38.2, 38.4, 38.1, 38.0];

    chartRef.current = new chartJS(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Cattle (M)',
            data: cattleData,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Camel (M)',
            data: camelData,
            borderColor: '#ea580c',
            backgroundColor: '#ea580c',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Goat (M)',
            data: goatData,
            borderColor: '#22c55e',
            backgroundColor: '#22c55e',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Sheep (M)',
            data: sheepData,
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 11
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context: any) {
                return `${context.dataset.label}: ${context.parsed.y}M`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Population (Millions)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartJS]);

  if (!chartJS) {
    return (
      <div 
        className="relative bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: '300px' }}
      >
        <p style={{ color: '#6b7280' }}>Loading chart...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '300px' }} className="relative">
      <canvas ref={canvasRef} />
    </div>
  );
}
