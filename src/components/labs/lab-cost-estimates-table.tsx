import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, CheckCircle2, AlertCircle, Package2 } from 'lucide-react';
import { DataTable } from '@/components/patients/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

type CostEstimate = {
  id: string;
  patientName: string;
  patientId: string;
  treatmentType: string;
  lab: string;
  totalCost: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date;
};

const mockData: CostEstimate[] = [
  {
    id: 'CE001',
    patientName: 'Jack Smile',
    patientId: '#3454',
    treatmentType: 'Bridge Metal',
    lab: 'Best Lab',
    totalCost: 1250.00,
    status: 'pending',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'CE002',
    patientName: 'Emma Health',
    patientId: '#3455',
    treatmentType: 'Crown Ceramic',
    lab: 'Premium Dental',
    totalCost: 950.00,
    status: 'in_progress',
    createdAt: new Date('2024-02-19'),
  },
];

const statusConfig = {
  pending: {
    label: 'Pending',
    Icon: Clock,
    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  in_progress: {
    label: 'In Progress',
    Icon: Package2,
    class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  completed: {
    label: 'Completed',
    Icon: CheckCircle2,
    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  rejected: {
    label: 'Rejected',
    Icon: AlertCircle,
    class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  },
};

export function LabCostEstimatesTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'patientName',
      header: 'Patient',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.patientName}</div>
          <div className="text-sm text-muted-foreground">{row.original.patientId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'treatmentType',
      header: 'Treatment',
      cell: ({ row }) => (
        <span className="hidden md:inline">{row.getValue('treatmentType')}</span>
      ),
    },
    {
      accessorKey: 'lab',
      header: 'Lab',
      cell: ({ row }) => (
        <span className="hidden md:inline">{row.getValue('lab')}</span>
      ),
    },
    {
      accessorKey: 'totalCost',
      header: 'Total Cost',
      cell: ({ row }) => (
        <div className="font-medium">
          €{row.original.totalCost.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const { Icon, label, class: className } = statusConfig[status];
        return (
          <Badge variant="secondary" className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => format(row.getValue('createdAt'), 'PP'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/lab/estimates/${row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">View</span>
        </Button>
      ),
    },
  ];

  // Mobile card view
  const renderMobileCard = (estimate: CostEstimate) => {
    const { Icon, label, class: className } = statusConfig[estimate.status];
    
    return (
      <Card key={estimate.id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{estimate.patientName}</div>
            <div className="text-sm text-muted-foreground">{estimate.patientId}</div>
          </div>
          <Badge variant="secondary" className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Treatment</div>
            <div>{estimate.treatmentType}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Cost</div>
            <div className="font-medium">€{estimate.totalCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Created</div>
            <div>{format(estimate.createdAt, 'PP')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Lab</div>
            <div>{estimate.lab}</div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lab/estimates/${estimate.id}`)}
          >
            <Eye className="w-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block">
        <DataTable columns={columns} data={mockData} searchKey="patientName" />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {mockData.map(renderMobileCard)}
      </div>
    </>
  );
}