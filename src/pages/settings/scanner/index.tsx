import { Card } from '@/components/ui/card';
import { MeditSetup } from './medit-setup';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function ScannerSettingsPage() {
  const [showMeditSetup, setShowMeditSetup] = useState(false);

  if (!showMeditSetup) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Scanner Settings</h1>
        
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowMeditSetup(true)}>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Medit Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your Medit i500/i700 scanner
              </p>
            </div>
            <Button>Connect Scanner</Button>
          </Card>

          {/* Add more scanner options here */}
          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">CEREC Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Coming soon
              </p>
            </div>
            <Button disabled>Connect Scanner</Button>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">iTero Scanner</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Coming soon
              </p>
            </div>
            <Button disabled>Connect Scanner</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setShowMeditSetup(false)}>
          ← Back
        </Button>
        <h1 className="text-2xl font-bold">Connect Medit Scanner</h1>
      </div>
      <MeditSetup />
    </div>
  );
}