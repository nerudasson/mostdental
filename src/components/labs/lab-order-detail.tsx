import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderScans } from '@/components/orders/order-scans';
import { LabOrderCheckInDialog } from './lab-order-checkin';
import { LabOrderCompleteDialog } from './lab-order-complete-dialog';
import { OrderHeader } from './order-detail/order-header';
import { PracticeDetails } from './order-detail/practice-details';
import { OrderDetails } from './order-detail/order-details';
import { CaseItems } from './order-detail/case-items';
import { InvoiceDetails } from './order-detail/invoice-details';
import { OrderMessagesSection } from './order-detail/order-messages-section';
import { useOrderStore } from '@/lib/orders/store';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import type { Order } from '@/lib/types/order';

interface LabOrderDetailProps {
  orderId?: string;
}

export function LabOrderDetail({ orderId }: LabOrderDetailProps) {
  const [showViewer, setShowViewer] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [openSections, setOpenSections] = useState({
    caseItems: true,
    invoice: true,
    messages: true
  });

  const { getOrder } = useOrderStore();
  const { estimates } = useCostEstimateStore();

  // Get order and connected estimate
  const order = getOrder(orderId || '');
  if (!order) return null;

  const estimate = estimates.find(e => 
    e.patient.id === order.patientId && 
    e.treatment.type === order.treatment.type
  );

  // Only show check-in UI for pending_checkin status
  const showCheckIn = order.status === 'pending_checkin';
  
  // Only show complete UI for in_progress status
  const showComplete = order.status === 'in_progress';

  return (
    <div className="space-y-6">
      <OrderHeader
        order={order}
        showViewer={showViewer}
        onToggleViewer={() => setShowViewer(!showViewer)}
        onCheckIn={showCheckIn ? () => setShowCheckInDialog(true) : undefined}
        onComplete={showComplete ? () => setShowCompleteDialog(true) : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scans */}
          {showViewer && (
            <Card>
              <CardHeader>
                <CardTitle>Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderScans orderId={order.id} />
              </CardContent>
            </Card>
          )}

          {/* Case Items */}
          <CaseItems
            items={order.treatment.items || []}
            open={openSections.caseItems}
            onOpenChange={(open) => 
              setOpenSections(prev => ({ ...prev, caseItems: open }))
            }
          />

          {/* Connected Cost Estimate */}
          {estimate && (
            <Card>
              <CardHeader>
                <CardTitle>Connected Cost Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Estimate ID</span>
                      <p className="font-medium">{estimate.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Created</span>
                      <p className="font-medium">
                        {estimate.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Cost</span>
                      <p className="font-medium">€{estimate.totalCost?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Lab Fees</span>
                      <p className="font-medium">€{estimate.labFees?.toFixed(2)}</p>
                    </div>
                  </div>

                  {estimate.notes && (
                    <div>
                      <span className="text-sm text-muted-foreground">Notes</span>
                      <p className="mt-1 text-sm">{estimate.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Invoice/Estimate */}
          <InvoiceDetails
            orderId={order.id}
            open={openSections.invoice}
            onOpenChange={(open) => 
              setOpenSections(prev => ({ ...prev, invoice: open }))
            }
          />

          {/* Messages */}
          <OrderMessagesSection
            orderId={order.id}
            open={openSections.messages}
            onOpenChange={(open) => 
              setOpenSections(prev => ({ ...prev, messages: open }))
            }
          />
        </div>

        {/* Right Column (1/3) - Order Details */}
        <div className="space-y-6">
          <PracticeDetails order={order} />
          <OrderDetails order={order} />
        </div>
      </div>

      {/* Dialogs */}
      {showCheckIn && (
        <LabOrderCheckInDialog
          open={showCheckInDialog}
          onOpenChange={setShowCheckInDialog}
          order={order}
        />
      )}

      {showComplete && (
        <LabOrderCompleteDialog
          open={showCompleteDialog}
          onOpenChange={setShowCompleteDialog}
          order={order}
        />
      )}
    </div>
  );
}