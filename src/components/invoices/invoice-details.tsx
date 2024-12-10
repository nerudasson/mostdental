import { format } from 'date-fns';
import { Download, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useInvoiceStore } from '@/stores/invoice-store';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailsProps {
  id: string;
}

export function InvoiceDetails({ id }: InvoiceDetailsProps) {
  const { toast } = useToast();
  const { getInvoice, generatePDF, updateInvoice } = useInvoiceStore();
  const invoice = getInvoice(id);

  if (!invoice) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Invoice not found
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const pdf = await generatePDF(id);
      
      // Create download link
      const url = URL.createObjectURL(pdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate invoice PDF',
        variant: 'destructive',
      });
    }
  };

  const handleSend = () => {
    updateInvoice(id, { status: 'sent' });
    toast({
      title: 'Invoice sent',
      description: 'The invoice has been sent to the dentist.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Invoice {invoice.number}</h1>
          <p className="text-sm text-muted-foreground">
            Created on {format(invoice.createdAt, 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {invoice.status === 'draft' && (
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="ml-2">
                {invoice.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Due Date</span>
              <p className="font-medium">{format(invoice.dueDate, 'PPP')}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Payment Terms</span>
              <p className="font-medium">{invoice.paymentTerms} days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-muted-foreground">Bank</span>
              <p className="font-medium">{invoice.bankDetails.bank}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">IBAN</span>
              <p className="font-medium">{invoice.bankDetails.iban}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">BIC</span>
              <p className="font-medium">{invoice.bankDetails.bic}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.positions.map((position, index) => (
                <TableRow key={index}>
                  <TableCell>{position.code}</TableCell>
                  <TableCell>{position.description}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell className="text-right">
                    €{position.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    €{(position.quantity * position.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-medium">
                  €{invoice.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invoice.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{invoice.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}