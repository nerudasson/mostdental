import { ChevronDown, ChevronUp } from 'lucide-react';
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

interface InvoiceDetailsProps {
  items: Array<{
    code: string;
    description: string;
    tooth: string;
    quantity: number;
    price: number;
  }>;
  totalCost: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetails({ 
  items, 
  totalCost,
  open, 
  onOpenChange 
}: InvoiceDetailsProps) {
  return (
    <Collapsible 
      open={open}
      onOpenChange={onOpenChange}
    >
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => onOpenChange(!open)}>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Details</CardTitle>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Tooth</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price (€)</TableHead>
                  <TableHead className="text-right">Total (€)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.tooth}</TableCell>
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
                  <TableCell colSpan={5} className="text-right font-medium">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {totalCost.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}