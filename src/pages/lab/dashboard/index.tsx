import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabCostEstimatesTable } from '@/components/labs/lab-cost-estimates-table';
import { LabOrdersTable } from '@/components/labs/lab-orders-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, Package2, Clock, AlertCircle } from 'lucide-react';

const mockStats = [
  {
    title: 'Ausstehende KVAs',
    value: '15',
    icon: CircleDollarSign,
    description: 'Warten auf Preiskalkulation',
    trend: '+23%',
  },
  {
    title: 'Aktive Aufträge',
    value: '28',
    icon: Package2,
    description: 'In Produktion',
    trend: '+12%',
  },
  {
    title: 'Heute fällig',
    value: '6',
    icon: Clock,
    description: 'Liefertermin',
    trend: '-15%',
  },
  {
    title: 'Verzögert',
    value: '2',
    icon: AlertCircle,
    description: 'Überfällige Aufträge',
    trend: '-50%',
  },
];

const mockRecentActivity = [
  {
    type: 'new_order',
    dentist: 'Dr. Schmidt',
    patient: 'Müller, Hans',
    description: 'Neue Brücke (Zirkon)',
    time: '10:30',
  },
  {
    type: 'scan_received',
    dentist: 'Dr. Weber',
    patient: 'Meyer, Anna',
    description: 'Digitaler Scan eingegangen',
    time: '09:45',
  },
  {
    type: 'order_completed',
    dentist: 'Dr. Fischer',
    patient: 'Wagner, Peter',
    description: 'Krone fertiggestellt',
    time: '09:15',
  },
];

export function LabDashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Labor Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
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
              <div className={`text-xs mt-2 ${
                stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend} gegenüber Vormonat
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="estimates" className="space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="estimates" className="flex-1">Kostenvoranschläge</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Aufträge</TabsTrigger>
            </TabsList>
            <TabsContent value="estimates">
              <LabCostEstimatesTable />
            </TabsContent>
            <TabsContent value="orders">
              <LabOrdersTable />
            </TabsContent>
          </Tabs>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Aktuelle Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{activity.dentist}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.patient}
                    </p>
                    <p className="text-sm">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}