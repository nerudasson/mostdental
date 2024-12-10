import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSecureTransfer } from '@/hooks/use-secure-transfer';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export function SecureInboxPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getFiles, downloadFile } = useSecureTransfer();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [downloading, setDownloading] = useState<string | null>(null);

  const files = user ? getFiles(user.id) : [];
  const filteredFiles = files.filter(file => 
    (filter === 'all' || !file.downloaded) &&
    (file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     file.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (file.patientId && file.patientId.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleDownload = async (fileId: string) => {
    if (!user) return;
    
    setDownloading(fileId);
    try {
      const file = await downloadFile(fileId, user.id);
      
      // Create download link
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'File downloaded successfully',
        description: file.name,
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Secure Inbox</h1>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          onClick={() => setFilter(filter === 'unread' ? 'all' : 'unread')}
          className="w-full sm:w-auto"
        >
          <Filter className="h-4 w-4 mr-2" />
          {filter === 'unread' ? 'Show All' : 'Show Unread'}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files, senders, or patient IDs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-4">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{file.name}</h3>
                    {!file.downloaded && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {file.patientId && `Patient ID: ${file.patientId} • `}
                    {format(new Date(file.createdAt), 'PPp')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                    {' • '}Expires {format(new Date(file.expiresAt), 'PP')}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleDownload(file.id)}
                disabled={downloading === file.id}
                className="w-full sm:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading === file.id ? 'Downloading...' : 'Download'}
              </Button>
            </div>
          </Card>
        ))}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No files found
          </div>
        )}
      </div>
    </div>
  );
}