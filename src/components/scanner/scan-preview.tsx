import { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { MeditScan } from '@/lib/api/medit';

interface ScanPreviewProps {
  scan: MeditScan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScanPreview({ scan, open, onOpenChange }: ScanPreviewProps) {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const currentFile = scan.files[currentFileIndex];

  const handleNext = () => {
    setCurrentFileIndex((prev) => 
      prev === scan.files.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevious = () => {
    setCurrentFileIndex((prev) => 
      prev === 0 ? scan.files.length - 1 : prev - 1
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Scan Preview</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentFileIndex + 1} / {scan.files.length}
              </span>
              <Button variant="ghost" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* Here you would integrate with a 3D viewer library */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            3D Preview Placeholder
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{currentFile.name}</div>
            <div className="text-sm text-muted-foreground">
              {scan.type}
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}