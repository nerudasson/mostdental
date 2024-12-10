import { useState } from 'react';
import { Eye, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateStatementPDF } from '@/lib/billing/statement-pdf';
import { useToast } from '@/hooks/use-toast';
import type { PaymentStatement } from '@/lib/types/billing';

interface StatementPreviewProps {
  statement: PaymentStatement;
}

export function StatementPreview({ statement }: StatementPreviewProps) {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handlePreview = async () => {
    try {
      const pdfBlob = generateStatementPDF(statement);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error) {
      toast({
        title: 'Preview failed',
        description: 'Failed to generate statement preview',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    try {
      const pdfBlob = generateStatementPDF(statement);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statement-${statement.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download started',
        description: 'Your statement PDF is being downloaded',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to generate statement PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handlePreview}>
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Statement Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {pdfUrl && (
            <div className="flex-1 w-full h-full min-h-0">
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-md"
                title="Statement Preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}