import { useState } from 'react';
import { QrCode, Loader2, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMeditStore } from '@/hooks/use-medit';
import QRCode from 'qrcode.react';

export function LabMeditSetup() {
  const [showQr, setShowQr] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoAccept, setAutoAccept] = useState(true);
  const { credentials, setCredentials, removeCredentials } = useMeditStore();

  // Generate unique setup URL for QR code
  const setupUrl = `https://medit.com/connect/lab-connect/${Math.random().toString(36).substring(7)}`;

  const handleScanClick = () => {
    setShowQr(true);
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setCredentials({
        clientId: 'auto-generated-id',
        clientSecret: 'auto-generated-secret',
        labMode: true,
      });
      setConnecting(false);
    }, 3000);
  };

  if (credentials) {
    return (
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium">Medit Connected</h3>
              <p className="text-sm text-muted-foreground">
                Ready to receive scans from dentists
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => removeCredentials()}>
            Disconnect
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Scan Reception Settings
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Auto-Accept Scans</Label>
              <p className="text-sm text-muted-foreground">
                Automatically accept scans from connected dentists
              </p>
            </div>
            <Switch
              checked={autoAccept}
              onCheckedChange={setAutoAccept}
            />
          </div>

          <Alert>
            <AlertDescription>
              When a dentist sends scans before creating an order, they'll be stored in a pending pool and can be matched to orders later.
            </AlertDescription>
          </Alert>
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
              <h3 className="text-lg font-medium">Connect Medit Lab Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your Medit Lab account to receive scans directly from dentists
              </p>
            </div>
            <Button onClick={handleScanClick} className="w-full">
              Start Lab Setup
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
                Connecting to Medit...
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