import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useOrderStore } from '@/lib/orders/store';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useAuth } from '@/hooks/use-auth';
import { Chart, registerables } from 'chart.js';
import { PieChart } from 'lucide-react';

Chart.register(...registerables);

export function HKPQuoteChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const { orders } = useOrderStore();
  const { estimates } = useCostEstimateStore();

  // Filter for current dentist
  const dentistEstimates = estimates.filter(est => est.dentist.id === user?.id);
  const dentistOrders = orders.filter(order => order.dentistId === user?.id);

  // Calculate conversion rate
  const totalEstimates = dentistEstimates.length;
  const convertedEstimates = dentistOrders.length;
  const unconvertedEstimates = totalEstimates - convertedEstimates;

  useEffect(() => {
    if (!chartRef.current || !user || totalEstimates === 0) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Converted to Orders', 'Pending Conversion'],
        datasets: [{
          data: [convertedEstimates, unconvertedEstimates],
          backgroundColor: [
            'rgb(34, 197, 94)', // green-500
            'rgb(234, 179, 8)', // yellow-500
          ],
          borderColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: theme === 'dark' ? '#ffffff' : '#000000',
              padding: 20,
              font: {
                size: 12,
                family: 'Inter',
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = ((value / totalEstimates) * 100).toFixed(1);
                return `${context.label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
        cutout: '70%',
      },
    });

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [theme, user, orders, estimates]);

  if (totalEstimates === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <PieChart className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-2">No HKP Data Yet</h3>
          <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
            This chart helps you track treatment plan conversions and identify opportunities to follow up with patients.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[300px] relative">
      <canvas ref={chartRef} />
      {chartInstance.current && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {totalEstimates > 0 
                ? ((convertedEstimates / totalEstimates) * 100).toFixed(1)
                : '0'}%
            </div>
            <div className="text-sm text-muted-foreground">
              Conversion Rate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}