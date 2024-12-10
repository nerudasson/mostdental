import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IntegrationCard } from '@/components/settings/integration-card';
import { 
  AlertCircle, 
  CheckCircle2, 
  RefreshCcw, 
  PlayCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Settings2,
  Workflow
} from 'lucide-react';

export function LabScannerPage() {
  const [activeTab, setActiveTab] = useState('scanners');
  const [configureType, setConfigureType] = useState<'threeshape' | 'exocad' | null>(null);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integration Setup</h1>
        <p className="text-muted-foreground">
          Connect your scanner systems and design software in a few simple steps
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <IntegrationCard
          title="3Shape TRIOS"
          description="Connect to 3Shape Communicate Portal"
          status="disconnected"
          connectUrl="https://connect.3shape.com/api/register"
          documentationUrl="https://developer.3shape.com"
          guideKey="3shape"
          fields={[
            { label: 'API Key', type: 'text', required: true },
            { label: 'API Secret', type: 'password', required: true },
            { label: 'Lab ID', type: 'text', required: true }
          ]}
          onConnect={(values) => {
            console.log('Connecting to 3Shape:', values);
          }}
        />

        <IntegrationCard
          title="iTero"
          description="Connect to iTero Connection Center"
          status="disconnected"
          connectUrl="https://itero.com/connect"
          documentationUrl="https://developer.itero.com"
          guideKey="itero"
          fields={[
            { label: 'Client ID', type: 'text', required: true },
            { label: 'Client Secret', type: 'password', required: true },
            { 
              label: 'Region', 
              type: 'select', 
              options: [
                { value: 'US', label: 'United States' },
                { value: 'EU', label: 'Europe' },
                { value: 'APAC', label: 'Asia Pacific' }
              ],
              required: true 
            }
          ]}
          onConnect={(values) => {
            console.log('Connecting to iTero:', values);
          }}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Processing Configuration</h2>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setConfigureType('threeshape')}>
            <Settings2 className="h-4 w-4 mr-2" />
            Configure 3Shape Processing
          </Button>
          <Button variant="outline" onClick={() => setConfigureType('exocad')}>
            <Settings2 className="h-4 w-4 mr-2" />
            Configure exocad Processing
          </Button>
        </div>
      </Card>
    </div>
  );
}