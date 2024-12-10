import { useState } from 'react';
import { QrCode, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { useMeditStore } from '@/hooks/use-medit';
import QRCode from 'qrcode.react';

export function MeditSetup() {
  const [showQr, setShowQr] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { credentials, setCredentials, removeCredentials } = useMeditStore();

  // Generate unique setup URL for QR code
  const setupUrl = `https://medit.com/connect/dental-connect/${Math.random().toString(36).substring(7)}`;

  const handleScanClick = () => {
    setShowQr(true);
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setCredentials({
        clientId: 'auto-generated-id',
        clientSecret: 'auto-generated-secret'
      });
      setConnecting(false);
    }, 3000);
  };

  if (credentials) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium">Scanner Connected</h3>
              <p className="text-sm text-muted-foreground">
                Your Medit scanner is ready to use
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => removeCredentials()}>
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!showQr ? (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <QrCode className="h-12 w-12 mx-auto text-primary" />
            <div>
              <h3 className="text-lg font-medium">Connect Your Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Scan a QR code with your phone to connect your Medit scanner
              </p>
            </div>
            <Button onClick={handleScanClick} className="w-full">
              Start Scanner Setup
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="text-center space-y-4">
            {connecting ? (
              <>
                <div className="flex justify-center">
                  <QRCode value={setupUrl} size={200} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Scan with Your Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    1. Open your phone's camera
                    <br />
                    2. Point it at the QR code
                    <br />
                    3. Follow the instructions on your phone
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Waiting for connection...
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Connecting to scanner...
              </div>
            )}
          </div>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}