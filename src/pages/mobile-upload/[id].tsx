import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Camera, Image as ImageIcon, Upload, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUploadSession, validateUpload } from '@/lib/utils/session';
import { validateAndProcessImage } from '@/lib/utils/file';

// ... rest of imports

export function MobileUploadPage() {
  const navigate = useNavigate();
  const { id: sessionId } = useParams();
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Validate session
    const session = getUploadSession(sessionId);
    if (!session) {
      setError('Upload session expired or invalid');
      return;
    }

    // Initialize WebSocket connection with auth
    socketRef.current = io(WEBSOCKET_URL, {
      query: { sessionId },
      auth: { token: sessionId },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      setConnected(true);
      setError(null);
    });

    socketRef.current.on('connect_error', (err) => {
      setError('Failed to connect to server');
      setConnected(false);
    });

    socketRef.current.on('disconnect', () => {
      setError('Connection lost');
      setConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionId]);

  const uploadFile = async (file: File) => {
    if (!socketRef.current || !sessionId) return;

    try {
      // Get session and validate upload
      const session = getUploadSession(sessionId);
      if (!session) {
        throw new Error('Upload session expired');
      }

      const validationResult = validateUpload(session, file);
      if (!validationResult.valid) {
        throw new Error(validationResult.error);
      }

      // Validate and process image
      const imageResult = await validateAndProcessImage(file);
      if (!imageResult.valid) {
        throw new Error(imageResult.error);
      }

      const processedFile = imageResult.processedFile!;

      // Initialize progress tracking
      setUploadProgress(prev => ({
        ...prev,
        [processedFile.name]: { progress: 0, status: 'uploading' },
      }));

      // Notify start of upload
      socketRef.current.emit('image:start', {
        fileName: processedFile.name,
        size: processedFile.size,
        type: processedFile.type,
      });

      // Read and convert file to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64data = e.target?.result as string;
        
        // Send the image data
        socketRef.current?.emit('image:data', {
          fileName: processedFile.name,
          data: base64data,
        });

        // Update progress to complete
        setUploadProgress(prev => ({
          ...prev,
          [processedFile.name]: { progress: 100, status: 'completed' },
        }));
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

      // Start reading the file
      reader.readAsDataURL(processedFile);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: { progress: 0, status: 'error' },
      }));
      setError(errorMessage);
    }
  };

  // ... rest of component code

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ... rest of JSX */}
      </div>
    </div>
  );
}