import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderScans } from '@/components/orders/order-scans';
import { CaseItems } from '@/components/orders/case-items';
import { InvoiceDetails } from '@/components/orders/invoice-details';
import { OrderMessagesSection } from '@/components/orders/order-messages-section';
import { OrderHeader } from '@/components/orders/order-header';
import { PracticeDetails } from '@/components/orders/practice-details';
import { OrderDetails } from '@/components/orders/order-details';
import { OrderAppointments } from '@/components/orders/order-appointments';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useOrderStore } from '@/lib/orders/store';
import { useAuth } from '@/hooks/use-auth';

export function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getOrder } = useOrderStore();
  const { estimates } = useCostEstimateStore();
  const [showViewer, setShowViewer] = useState(false);
  const [openSections, setOpenSections] = useState({
    caseItems: true,
    estimate: true,
    invoice: true,
    messages: true
  });

  const order = getOrder(id || '');
  if (!order) return null;

  // Find connected cost estimate
  const estimate = estimates.find(e => 
    e.patient.id === order.patientId && 
    e.treatment.type === order.treatment.type
  );

  return (
    <div className="space-y-6">
      <OrderHeader
        order={order}
        showViewer={showViewer}
        onToggleViewer={() => setShowViewer(!showViewer)}
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

          {/* Appointments */}
          <OrderAppointments orderId={order.id} />

          {/* Case Items */}
          <CaseItems
            items={order.treatment.items || []}
            open={openSections.caseItems}
            onOpenChange={(open) => 
              setOpenSections(prev => ({ ...prev, caseItems: open }))
            }
          />

          {/* Cost Estimate */}
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
            items={order.invoiceItems || []}
            totalCost={order.totalCost}
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
    </div>
  );
}