import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Download, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface InvoiceListProps {
  labId?: string;
  dentistId?: string;
}

const statusStyles = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

// Mock data
const mockInvoices = [
  {
    id: '1',
    number: 'INV-001',
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    patientId: 'P001',
    totalAmount: 1250.00,
    paidAmount: 0,
    status: 'draft' as const,
  },
  {
    id: '2',
    number: 'INV-002',
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    patientId: 'P002',
    totalAmount: 850.00,
    paidAmount: 850.00,
    status: 'paid' as const,
  },
];

export function InvoiceList({ labId, dentistId }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mobile card view
  const renderMobileCard = (invoice: typeof mockInvoices[0]) => (
    <Card key={invoice.id} className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium">{invoice.number}</div>
          <div className="text-sm text-muted-foreground">{invoice.patientId}</div>
        </div>
        <Badge variant="secondary" className={statusStyles[invoice.status]}>
          {invoice.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Amount</div>
          <div className="font-medium">€{invoice.totalAmount.toFixed(2)}</div>
          {invoice.paidAmount > 0 && (
            <div className="text-sm text-muted-foreground">
              Paid: €{invoice.paidAmount.toFixed(2)}
            </div>
          )}
        </div>
        <div>
          <div className="text-muted-foreground">Due Date</div>
          <div>{format(invoice.dueDate, 'PP')}</div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.number}
                </TableCell>
                <TableCell>
                  {format(invoice.date, 'PP')}
                </TableCell>
                <TableCell>{invoice.patientId}</TableCell>
                <TableCell>
                  €{invoice.totalAmount.toFixed(2)}
                  {invoice.paidAmount > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Paid: €{invoice.paidAmount.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell>{format(invoice.dueDate, 'PP')}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={statusStyles[invoice.status]}
                  >
                    {invoice.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">No invoices found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredInvoices.map(renderMobileCard)}
        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No invoices found
          </div>
        )}
      </div>
    </div>
  );
}