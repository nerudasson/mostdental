import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabCostEstimatesTable } from '@/components/labs/lab-cost-estimates-table';
import { LabOrdersTable } from '@/components/labs/lab-orders-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, Package2, Clock, AlertCircle } from 'lucide-react';

export function LabDashboardPage() {
  const { t } = useTranslation();

  const stats = [
    {
      title: 'Pending Estimates',
      value: '12',
      icon: CircleDollarSign,
      description: 'Awaiting pricing',
    },
    {
      title: 'Active Orders',
      value: '8',
      icon: Package2,
      description: 'In production',
    },
    {
      title: 'Due Today',
      value: '3',
      icon: Clock,
      description: 'Delivery deadline',
    },
    {
      title: 'Delayed',
      value: '1',
      icon: AlertCircle,
      description: 'Past due date',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lab Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="estimates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estimates">Cost Estimates</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="estimates">
          <LabCostEstimatesTable />
        </TabsContent>
        <TabsContent value="orders">
          <LabOrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}