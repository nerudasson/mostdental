import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Eye, Clock, Package2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataTable } from '@/components/patients/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

type LabOrder = {
  id: string;
  dentist: {
    name: string;
    practice: string;
  };
  patient: string;
  treatmentType: string;
  dueDate: Date;
  status: 'pending' | 'in_production' | 'completed' | 'delayed';
  priority: 'normal' | 'high' | 'urgent';
};

const mockData: LabOrder[] = [
  {
    id: 'LO001',
    dentist: {
      name: 'Dr. Smith',
      practice: 'Smith Dental',
    },
    patient: '#3454',
    treatmentType: 'Bridge Metal',
    dueDate: new Date('2024-03-01'),
    status: 'pending',
    priority: 'normal',
  },
  {
    id: 'LO002',
    dentist: {
      name: 'Dr. Johnson',
      practice: 'City Dental',
    },
    patient: '#3455',
    treatmentType: 'Crown Ceramic',
    dueDate: new Date('2024-02-25'),
    status: 'in_production',
    priority: 'urgent',
  },
];

const statusConfig = {
  pending: {
    label: 'Pending',
    Icon: Clock,
    class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  },
  in_production: {
    label: 'In Production',
    Icon: Package2,
    class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  completed: {
    label: 'Completed',
    Icon: CheckCircle2,
    class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  delayed: {
    label: 'Delayed',
    Icon: AlertCircle,
    class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  },
};

const priorityStyles = {
  normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

export function LabOrdersTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'dentist',
      header: 'Dentist',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.dentist.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.dentist.practice}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'patient',
      header: 'Patient ID',
    },
    {
      accessorKey: 'treatmentType',
      header: 'Treatment',
      cell: ({ row }) => (
        <span className="hidden md:inline">{row.getValue('treatmentType')}</span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <Badge variant="secondary" className={priorityStyles[row.original.priority]}>
          {row.original.priority.toUpperCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => format(row.original.dueDate, 'PP'),
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
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/lab/orders/${row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">View</span>
        </Button>
      ),
    },
  ];

  // Mobile card view
  const renderMobileCard = (order: LabOrder) => {
    const { Icon, label, class: className } = statusConfig[order.status];
    
    return (
      <Card key={order.id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{order.dentist.name}</div>
            <div className="text-sm text-muted-foreground">
              {order.dentist.practice}
            </div>
          </div>
          <Badge variant="secondary" className={className}>
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Patient ID</div>
            <div>{order.patient}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Treatment</div>
            <div>{order.treatmentType}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Due Date</div>
            <div>{format(order.dueDate, 'PP')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Priority</div>
            <Badge variant="secondary" className={priorityStyles[order.priority]}>
              {order.priority.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lab/orders/${order.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
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
        <DataTable columns={columns} data={mockData} searchKey="id" />
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {mockData.map(renderMobileCard)}
      </div>
    </>
  );
}