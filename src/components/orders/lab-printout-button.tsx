import { useState } from 'react';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { generateLabPrintout } from '@/lib/utils/lab-printout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { Order } from '@/lib/types/order';

interface LabPrintoutButtonProps {
  order: Order;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LabPrintoutButton({ 
  order, 
  variant = 'outline',
  size = 'sm'
}: LabPrintoutButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);

  // Return null if not a lab user
  if (user?.role !== 'lab') {
    return null;
  }

  const handlePrintout = async (type: 'print' | 'download', options = {}) => {
    try {
      setGenerating(true);
      const pdf = await generateLabPrintout(order, options);

      if (type === 'print') {
        // Create temporary URL and open print dialog
        const url = URL.createObjectURL(pdf);
        const printWindow = window.open(url);
        printWindow?.print();
        URL.revokeObjectURL(url);
      } else {
        // Download file
        const url = URL.createObjectURL(pdf);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lab-order-${order.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      toast({
        title: type === 'print' ? 'Print job sent' : 'Download started',
        description: type === 'print' 
          ? 'The lab printout has been sent to your printer'
          : 'Your download should begin shortly',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate lab printout',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={generating}>
          <Printer className="h-4 w-4 mr-2" />
          {generating ? 'Generating...' : 'Lab Printout'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handlePrintout('print', { showSignature: true })}>
          <Printer className="h-4 w-4 mr-2" />
          Print with Signature
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrintout('print', { showSignature: false })}>
          <Printer className="h-4 w-4 mr-2" />
          Print without Signature
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handlePrintout('download', { 
          showSignature: true,
          showCost: true 
        })}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}