import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings2, History, ListChecks } from 'lucide-react';
import { ProcessingQueue } from '@/components/scan-processing/processing-queue';
import { ProcessingConfig } from '@/components/scan-processing/processing-config';
import { ProcessingHistory } from '@/components/scan-processing/processing-history';
import { ScanVaultList } from '@/components/scan-vault/scan-vault-list';

export function ScanProcessingPage() {
  const [activeTab, setActiveTab] = useState('queue');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scan Processing</h1>
        <Button variant="outline" onClick={() => setActiveTab('config')}>
          <Settings2 className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Processing Queue
          </TabsTrigger>
          <TabsTrigger value="vault" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Scan Vault
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="queue">
            <ProcessingQueue />
          </TabsContent>

          <TabsContent value="vault">
            <ScanVaultList />
          </TabsContent>

          <TabsContent value="history">
            <ProcessingHistory />
          </TabsContent>

          <TabsContent value="config">
            <ProcessingConfig />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}