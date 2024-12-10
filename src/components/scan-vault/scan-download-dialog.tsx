import { useState } from 'react';
import { FileText, Download, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScanVault } from '@/lib/scan-vault/store';
import type { VaultedScan, VaultedFile } from '@/lib/scan-vault/types';

interface ScanDownloadDialogProps {
  scan: VaultedScan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScanDownloadDialog({
  scan,
  open,
  onOpenChange
}: ScanDownloadDialogProps) {
  const [downloading, setDownloading] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const { markFileDownloaded } = useScanVault();

  const handleDownload = async (file: VaultedFile) => {
    setDownloading(prev => [...prev, file.id]);
    setProgress(prev => ({ ...prev, [file.id]: 0 }));

    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(prev => ({ ...prev, [file.id]: i }));
      }

      markFileDownloaded(scan.id, file.id);
    } finally {
      setDownloading(prev => prev.filter(id => id !== file.id));
      setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.id];
        return newProgress;
      });
    }
  };

  const handleDownloadAll = () => {
    scan.files.forEach(file => {
      if (!file.downloaded) {
        handleDownload(file);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Download Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button 
            onClick={handleDownloadAll}
            disabled={scan.files.every(f => f.downloaded)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>

          <ScrollArea className="h-[300px] rounded-md border">
            <div className="p-4 space-y-2">
              {scan.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>

                  {file.downloaded ? (
                    <Button variant="ghost" size="sm" disabled>
                      <Check className="h-4 w-4 mr-1" />
                      Downloaded
                    </Button>
                  ) : downloading.includes(file.id) ? (
                    <div className="w-[100px]">
                      <Progress value={progress[file.id]} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}