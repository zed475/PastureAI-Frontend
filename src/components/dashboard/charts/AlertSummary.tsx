'use client';

import { useEffect, useRef, useState } from 'react';

export default function AlertSummary() {
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

    const alertTypes = ['Drought', 'Disease', 'Weather', 'Resource', 'NDVI', 'Market'];
    
    // Alert counts by severity
    const criticalData = [3, 1, 0, 1, 2, 0];
    const highData = [4, 2, 2, 1, 3, 1];
    const mediumData = [2, 1, 3, 2, 1, 2];
    const lowData = [1, 0, 1, 1, 0, 1];

    chartRef.current = new chartJS(ctx, {
      type: 'bar',
      data: {
        labels: alertTypes,
        datasets: [
          {
            label: 'Critical',
            data: criticalData,
            backgroundColor: '#dc2626',
            borderRadius: 4
          },
          {
            label: 'High',
            data: highData,
            backgroundColor: '#f97316',
            borderRadius: 4
          },
          {
            label: 'Medium',
            data: mediumData,
            backgroundColor: '#eab308',
            borderRadius: 4
          },
          {
            label: 'Low',
            data: lowData,
            backgroundColor: '#3b82f6',
            borderRadius: 4
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
            mode: 'index'
          }
        },
        scales: {
          x: {
            stacked: false,
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            stacked: false,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Alerts'
            },
            ticks: {
              stepSize: 1
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
        style={{ height: '280px' }}
      >
        <p style={{ color: '#6b7280' }}>Loading chart...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '280px' }} className="relative">
      <canvas ref={canvasRef} />
    </div>
  );
}
