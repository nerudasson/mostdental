import { useState } from 'react';
import { Upload, Search, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/hooks/use-notifications';
import { useSecureTransfer } from '@/hooks/use-secure-transfer';

interface SecureSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockLabs = [
  { id: '1', name: 'Best Lab', location: 'Berlin' },
  { id: '2', name: 'Premium Dental', location: 'Munich' },
  { id: '3', name: 'City Lab', location: 'Hamburg' },
];

export function SecureSendDialog({ open, onOpenChange }: SecureSendDialogProps) {
  const { toast } = useToast();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { sendFiles } = useSecureTransfer();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [patientId, setPatientId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredLabs = mockLabs.filter(lab => 
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    try {
      // Check file size (max 100MB per file)
      files.forEach(file => {
        if (file.size > 100 * 1024 * 1024) {
          throw new Error('Files must be less than 100MB');
        }
      });

      setSelectedFiles(prev => [...prev, ...files]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error selecting files');
    }

    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!selectedLab || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // Send files securely
      await sendFiles({
        files: selectedFiles,
        labId: selectedLab,
        patientId: patientId || undefined,
      });

      // Notify lab
      addNotification({
        type: 'secure_transfer',
        title: 'New Secure Transfer',
        description: `${selectedFiles.length} files received from Dr. Smith`,
      });

      toast({
        title: 'Files sent successfully',
        description: 'The lab will be notified of the secure transfer.',
      });

      onOpenChange(false);
    } catch (err) {
      setError('Failed to send files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Secure File Transfer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <Label>Files</Label>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{file.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lab Selection */}
          <div className="space-y-4">
            <Label>Select Lab</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search labs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2">
              {filteredLabs.map((lab) => (
                <div
                  key={lab.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedLab === lab.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setSelectedLab(lab.id)}
                >
                  <div className="font-medium">{lab.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {lab.location}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Patient ID */}
          <div className="space-y-2">
            <Label>Patient ID (Optional)</Label>
            <Input
              placeholder="Enter patient ID..."
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={65} />
              <p className="text-sm text-center text-muted-foreground">
                Uploading files...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedLab || selectedFiles.length === 0 || uploading}
          >
            Send Files
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}