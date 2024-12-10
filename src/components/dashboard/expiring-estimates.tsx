import { useState } from 'react';
import { format, addMonths, isAfter, isBefore } from 'date-fns';
import { Bell, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCostEstimateStore } from '@/stores/cost-estimates';
import { useAuth } from '@/hooks/use-auth';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useToast } from '@/hooks/use-toast';

export function ExpiringEstimates() {
  const { user } = useAuth();
  const { estimates } = useCostEstimateStore();
  const { addNotification } = useNotificationStore();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  // Filter estimates that are expiring soon (within 2 weeks of 6 months)
  const expiringEstimates = estimates.filter(estimate => {
    if (estimate.dentist.id !== user?.id) return false;
    if (estimate.status !== 'pending') return false;

    const expiryDate = addMonths(new Date(estimate.createdAt), 6);
    const twoWeeksBeforeExpiry = addMonths(new Date(estimate.createdAt), 5.5);
    const now = new Date();

    return isAfter(now, twoWeeksBeforeExpiry) && isBefore(now, expiryDate);
  });

  const handleSendReminders = async () => {
    setSending(true);
    try {
      // Send notifications for each expiring estimate
      expiringEstimates.forEach(estimate => {
        const expiryDate = addMonths(new Date(estimate.createdAt), 6);
        
        addNotification({
          type: 'estimate_request',
          title: 'Cost Estimate Expiring',
          description: `Cost estimate for ${estimate.patient.name} will expire on ${format(expiryDate, 'PP')}`,
          estimateId: estimate.id,
        });
      });

      toast({
        title: 'Reminders sent',
        description: `Sent reminders for ${expiringEstimates.length} expiring estimates`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reminders',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (expiringEstimates.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-medium mb-2">No Expiring Estimates</h3>
          <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
            All cost estimates are within their validity period. You'll be notified when estimates are close to expiration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expiringEstimates.map((estimate) => (
        <div
          key={estimate.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{estimate.patient.name}</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Expiring Soon
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {estimate.treatment.type} - {estimate.treatment.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Expires {format(addMonths(new Date(estimate.createdAt), 6), 'PP')}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={handleSendReminders} 
          disabled={sending}
        >
          <Bell className="h-4 w-4 mr-2" />
          {sending ? 'Sending...' : 'Send Reminders'}
        </Button>
      </div>
    </div>
  );
}