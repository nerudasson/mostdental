import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Package2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { DentistEstimateDetail } from '@/components/cost-estimate/dentist-estimate-detail';
import { LabEstimateDetail } from '@/components/cost-estimate/lab-estimate-detail';

export function EstimateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {user.role === 'dentist' ? (
        <DentistEstimateDetail id={id} />
      ) : (
        <LabEstimateDetail id={id} />
      )}
    </div>
  );
}