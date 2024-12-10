import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SecureSendDialog } from './secure-send-dialog';

export function SecureSendButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <Shield className="h-4 w-4 mr-2" />
        Secure Send
      </Button>

      <SecureSendDialog 
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}