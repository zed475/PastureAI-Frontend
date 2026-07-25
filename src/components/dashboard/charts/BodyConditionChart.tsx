'use client';

import { useEffect, useRef, useState } from 'react';

export default function BodyConditionChart() {
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

    // Body Condition Score (BCS) distribution
    // BCS scale: 1 = emaciated, 5 = obese
    // For pastoral livestock, ideal is 3-3.5

    const bcsLabels = ['Score 1\n(Emaciated)', 'Score 2\n(Very Thin)', 'Score 3\n(Thin)', 'Score 4\n(Moderate)', 'Score 5\n(Fat)'];
    
    // Percentage of livestock in each BCS category by region/type
    const somaliData = [8, 25, 42, 20, 5];
    const oromiaData = [4, 18, 38, 30, 10];
    const afarData = [12, 32, 35, 16, 5];

    chartRef.current = new chartJS(ctx, {
      type: 'bar',
      data: {
        labels: bcsLabels,
        datasets: [
          {
            label: 'Somali Region',
            data: somaliData,
            backgroundColor: '#f97316',
            borderRadius: 6,
          },
          {
            label: 'Oromia Pastoral',
            data: oromiaData,
            backgroundColor: '#22c55e',
            borderRadius: 6,
          },
          {
            label: 'Afar Region',
            data: afarData,
            backgroundColor: '#ef4444',
            borderRadius: 6,
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
            callbacks: {
              label: function(context: any) {
                return `${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          y: {
            beginAtZero: true,
            max: 50,
            title: {
              display: true,
              text: '% of Livestock'
            },
            ticks: {
              callback: function(value: any) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
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
      
      {/* BCS Reference */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <strong>Body Condition Score (BCS) Reference:</strong> Scale of 1-5 where 
        <span className="text-red-600 font-medium"> 1-2 </span> indicates poor condition requiring intervention, 
        <span className="text-yellow-600 font-medium"> 2.5-3.5 </span> is acceptable for dry season, and 
        <span className="text-green-600 font-medium"> 4+ </span> is excellent condition.
      </div>
    </div>
  );
}
