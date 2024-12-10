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

interface CaseItem {
  type: string;
  tooth: string;
  item: string;
  shade: string;
  design: string;
  features: string;
}

interface CaseItemsProps {
  items: CaseItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CaseItems({ items, open, onOpenChange }: CaseItemsProps) {
  return (
    <Collapsible 
      open={open}
      onOpenChange={onOpenChange}
    >
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => onOpenChange(!open)}>
          <div className="flex items-center justify-between">
            <CardTitle>Case Items</CardTitle>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Tooth #</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Shade</TableHead>
                  <TableHead>Design</TableHead>
                  <TableHead>Features</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.tooth}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.shade}</TableCell>
                    <TableCell>{item.design}</TableCell>
                    <TableCell>{item.features}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}