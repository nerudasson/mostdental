import { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, Image as ImageIcon, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRCode from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { createUploadSession } from '@/lib/utils/session';

// ... rest of imports

export function MobileImageUpload({
  open,
  onOpenChange,
  onImagesReceived,
}: MobileImageUploadProps) {
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [connected, setConnected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ImageUploadProgress>({});
  const [receivedImages, setReceivedImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebSocket connection and session when dialog opens
  useEffect(() => {
    if (open) {
      // Create new upload session
      const session = createUploadSession();
      setSessionId(session.id);
      
      // Create upload URL for QR code
      const baseUrl = window.location.origin;
      setUploadUrl(`${baseUrl}/mobile-upload/${session.id}`);

      // Initialize WebSocket connection
      socketRef.current = io(WEBSOCKET_URL, {
        query: { sessionId: session.id },
        transports: ['websocket'],
        auth: { token: session.id }, // Use session ID as auth token
      });

      // Connection events
      socketRef.current.on('connect', () => {
        setConnected(true);
        setError(null);
        toast({
          title: 'Connected',
          description: 'Ready to receive images from your mobile device',
        });
      });

      socketRef.current.on('connect_error', (err) => {
        setError('Failed to establish connection');
        toast({
          title: 'Connection Error',
          description: err.message,
          variant: 'destructive',
        });
      });

      socketRef.current.on('disconnect', () => {
        setConnected(false);
        setError('Connection lost');
        toast({
          title: 'Disconnected',
          description: 'Connection to server lost',
          variant: 'destructive',
        });
      });

      // Image transfer events with validation
      socketRef.current.on('image:start', ({ fileName, size, type }) => {
        // Validate file before accepting
        if (size > session.maxFileSize) {
          socketRef.current?.emit('image:error', {
            fileName,
            error: 'File size too large',
          });
          return;
        }

        if (!session.allowedTypes.includes(type)) {
          socketRef.current?.emit('image:error', {
            fileName,
            error: 'File type not allowed',
          });
          return;
        }

        setUploadProgress(prev => ({
          ...prev,
          [fileName]: 0,
        }));
      });

      // ... rest of event handlers

      // Cleanup function
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
        setSessionId('');
        setConnected(false);
        setUploadProgress({});
        setReceivedImages([]);
        setError(null);
      };
    }
  }, [open]);

  // ... rest of component code

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Images from Mobile Device</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <QRCode value={uploadUrl} size={200} />
            </div>
          </div>

          {/* Session expiry warning */}
          <div className="text-center text-sm text-muted-foreground">
            This upload link will expire in 15 minutes
          </div>

          {/* ... rest of JSX */}
        </div>
      </DialogContent>
    </Dialog>
  );
}