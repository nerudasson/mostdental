import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: Date;
  nextVisit: Date | null;
  status: 'active' | 'pending' | 'inactive';
};

const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
        </button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'lastVisit',
    header: 'Last Visit',
    cell: ({ row }) => {
      return format(row.getValue('lastVisit'), 'PP');
    },
  },
  {
    accessorKey: 'nextVisit',
    header: 'Next Visit',
    cell: ({ row }) => {
      const value = row.getValue('nextVisit');
      return value ? format(value as Date, 'PP') : '-';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant="secondary" className={statusStyles[status as keyof typeof statusStyles]}>
          {status}
        </Badge>
      );
    },
  },
];