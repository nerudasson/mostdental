import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderMessages } from '@/components/orders/order-messages';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface OrderMessagesSectionProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderMessagesSection({
  orderId,
  open,
  onOpenChange,
}: OrderMessagesSectionProps) {
  return (
    <Collapsible
      open={open}
      onOpenChange={onOpenChange}
    >
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => onOpenChange(!open)}>
          <div className="flex items-center justify-between">
            <CardTitle>Messages</CardTitle>
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
            <OrderMessages orderId={orderId} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}