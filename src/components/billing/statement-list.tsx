import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Download, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useBillingStore } from '@/stores/billing-store';
import { useAuth } from '@/hooks/use-auth';

const statusConfig = {
  pending: {
    label: 'Pending',
    Icon: Clock,
    class: 'bg-yellow-100 text-yellow-800',
  },
  paid: {
    label: 'Paid',
    Icon: CheckCircle2,
    class: 'bg-green-100 text-green-800',
  },
  overdue: {
    label: 'Overdue',
    Icon: AlertCircle,
    class: 'bg-red-100 text-red-800',
  },
};

export function StatementList() {
  const { user } = useAuth();
  const { statements } = useBillingStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Get statements based on user role
  const userStatements = user?.role === 'lab' 
    ? useBillingStore((state) => state.getStatementsByLab(user.id))
    : useBillingStore((state) => state.getStatementsByDentist(user.id));

  const filteredStatements = userStatements.filter(statement => 
    statement.orders.some(order => 
      order.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDownload = (statementId: string) => {
    // Implement statement PDF download
  };

  // Mobile card view
  const renderMobileCard = (statement: any) => {
    const StatusIcon = statusConfig[statement.status].Icon;
    
    return (
      <Card key={statement.id} className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">Statement #{statement.id}</div>
            <div className="text-sm text-muted-foreground">
              {statement.period 
                ? `${format(statement.period.startDate, 'PP')} - ${format(statement.period.endDate, 'PP')}`
                : format(statement.createdAt, 'PP')
              }
            </div>
          </div>
          <Badge variant="secondary" className={statusConfig[statement.status].class}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig[statement.status].label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Orders</div>
          {statement.orders.map((order: any) => (
            <div key={order.id} className="text-sm">
              {order.description} - €{order.amount.toFixed(2)}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
            <div className="font-medium">€{statement.totalAmount.toFixed(2)}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleDownload(statement.id)}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search statements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredStatements.map(renderMobileCard)}
        {filteredStatements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No statements found
          </div>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Statement #</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Period</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Total Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStatements.map((statement) => (
                <tr key={statement.id}>
                  <td className="px-4 py-3 text-sm">{statement.id}</td>
                  <td className="px-4 py-3 text-sm">
                    {statement.period 
                      ? `${format(statement.period.startDate, 'PP')} - ${format(statement.period.endDate, 'PP')}`
                      : format(statement.createdAt, 'PP')
                    }
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {statement.orders.length} orders
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    €{statement.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={statusConfig[statement.status].class}>
                      <statusConfig[statement.status].Icon className="w-3 h-3 mr-1" />
                      {statusConfig[statement.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(statement.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredStatements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No statements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}