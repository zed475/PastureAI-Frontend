'use client';

import { useEffect, useRef, useState } from 'react';

interface NDVIChartProps {
  height?: number;
}

export default function NDVIChart({ height = 250 }: NDVIChartProps) {
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

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Generate realistic NDVI data for Ethiopian pastoral regions
    const somaliData = [0.35, 0.33, 0.32, 0.34, 0.38, 0.42, 0.45, 0.43, 0.40, 0.38, 0.36, 0.35];
    const oromiaData = [0.42, 0.40, 0.41, 0.45, 0.50, 0.55, 0.58, 0.56, 0.52, 0.48, 0.44, 0.42];
    const afarData = [0.28, 0.26, 0.27, 0.30, 0.34, 0.37, 0.39, 0.38, 0.35, 0.31, 0.29, 0.28];

    chartRef.current = new chartJS(ctx, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Somali Region',
            data: somaliData,
            borderColor: '#f97316',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: 'Oromia Pastoral',
            data: oromiaData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: 'Afar Region',
            data: afarData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
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
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context: any) {
                const value = context.parsed?.y;
                return `${context.dataset.label}: ${value !== null && value !== undefined ? value.toFixed(2) : 'N/A'}`;
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
            min: 0,
            max: 0.8,
            title: {
              display: true,
              text: 'NDVI Value'
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
  }, [chartJS, height]);

  if (!chartJS) {
    return (
      <div 
        className="relative bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p style={{ color: '#6b7280' }}>Loading chart...</p>
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px` }} className="relative">
      <canvas ref={canvasRef} />
      
      {/* Threshold Lines Annotation */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-400 pointer-events-none">
        <span>0 (Barren)</span>
        <span className="text-yellow-600">0.25</span>
        <span className="text-green-600">0.5</span>
        <span>0.75+</span>
      </div>
    </div>
  );
}
