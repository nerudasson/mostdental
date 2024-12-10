import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailsProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetails({ 
  orderId,
  open, 
  onOpenChange 
}: InvoiceDetailsProps) {
  const { toast } = useToast();
  const { invoices, generatePDF } = useInvoiceStore();
  const { estimates } = useCostEstimateStore();
  
  // Find invoice for this order
  const invoice = invoices.find(inv => inv.orderId === orderId);
  // Find estimate for this order if no invoice exists
  const estimate = estimates.find(est => est.id === orderId);

  const handleDownload = async () => {
    if (!invoice) return;

    try {
      const pdf = await generatePDF(invoice.id);
      
      // Create download link
      const url = URL.createObjectURL(pdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download invoice',
        variant: 'destructive',
      });
    }
  };

  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
    >
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => onOpenChange(!open)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>{invoice ? 'Invoice' : 'Cost Estimate'}</CardTitle>
              {invoice && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {open ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {invoice ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price (€)</TableHead>
                    <TableHead className="text-right">Total (€)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.positions.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.quantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium">
                      Total:
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {invoice.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : estimate ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Estimated Cost (€)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{estimate.treatment.type}</TableCell>
                      <TableCell>{estimate.treatment.description}</TableCell>
                      <TableCell className="text-right">
                        {estimate.totalCost?.toFixed(2) || '-'}
                      </TableCell>
                    </TableRow>
                    {estimate.labFees && (
                      <TableRow>
                        <TableCell>Lab Fees</TableCell>
                        <TableCell>Laboratory work and materials</TableCell>
                        <TableCell className="text-right">
                          {estimate.labFees.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-medium">
                        Total Estimate:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {((estimate.totalCost || 0) + (estimate.labFees || 0)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="mt-4 text-sm text-muted-foreground">
                  * Final invoice will be generated upon completion
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No cost estimate or invoice available yet
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}