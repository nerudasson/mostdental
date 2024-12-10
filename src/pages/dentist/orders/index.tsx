import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/patients/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, CheckCircle2, AlertCircle, Package2 } from 'lucide-react';
import { format } from 'date-fns';

type Order = {
  id: string;
  patientName: string;
  patientId: string;
  treatmentType: string;
  lab: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date;
  dueDate: Date;
};

const mockData: Order[] = [
  {
    id: 'O001',
    patientName: 'Jack Smile',
    patientId: '#3454',
    treatmentType: 'Bridge Metal',
    lab: 'Best Lab',
    status: 'pending',
    createdAt: new Date('2024-02-20'),
    dueDate: new Date('2024-03-01'),
  },
  {
    id: 'O002',
    patientName: 'Emma Health',
    patientId: '#3455',
    treatmentType: 'Crown Ceramic',
    lab: 'Premium Dental',
    status: 'in_progress',
    createdAt: new Date('2024-02-19'),
    dueDate: new Date('2024-02-28'),
  },
];

const statusStyles = {
  pending: {
    label: 'Pending',
    icon: Clock,
    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  in_progress: {
    label: 'In Progress',
    icon: Package2,
    class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  rejected: {
    label: 'Rejected',
    icon: AlertCircle,
    class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  },
};

export function OrdersPage() {
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
          <div>{row.original.patientName}</div>
          <div className="text-sm text-muted-foreground">{row.original.patientId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'treatmentType',
      header: 'Treatment',
    },
    {
      accessorKey: 'lab',
      header: 'Lab',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const StatusIcon = statusStyles[status].icon;
        return (
          <Badge variant="secondary" className={statusStyles[status].class}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusStyles[status].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => format(row.original.dueDate, 'PP'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/orders/${row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t('nav.orders')}</h1>
      <DataTable columns={columns} data={mockData} searchKey="patientName" />
    </div>
  );
}