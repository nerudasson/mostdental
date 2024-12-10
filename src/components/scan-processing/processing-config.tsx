import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FolderOpen, Settings2 } from 'lucide-react';
import { useScanVault } from '@/lib/scan-vault/store';
import type { ProcessingConfig } from '@/lib/scan-vault/types';

export function ProcessingConfig() {
  const { config, updateConfig } = useScanVault();
  const [localConfig, setLocalConfig] = useState<ProcessingConfig>(config);

  const handleSave = () => {
    updateConfig(localConfig);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Processing Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 3Shape Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium">3Shape Configuration</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Enable 3Shape Processing</Label>
                <Switch
                  checked={localConfig.threeshape?.enabled}
                  onCheckedChange={(checked) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      threeshape: {
                        ...prev.threeshape,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </div>
              {localConfig.threeshape?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Import Location</Label>
                    <div className="flex gap-2">
                      <Input
                        value={localConfig.threeshape?.importLocation}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            threeshape: {
                              ...prev.threeshape,
                              importLocation: e.target.value,
                            },
                          }))
                        }
                      />
                      <Button variant="outline" size="icon">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Generate XML Files</Label>
                    <Switch
                      checked={localConfig.threeshape?.createXml}
                      onCheckedChange={(checked) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          threeshape: {
                            ...prev.threeshape,
                            createXml: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* exocad Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium">exocad Configuration</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Enable exocad Processing</Label>
                <Switch
                  checked={localConfig.exocad?.enabled}
                  onCheckedChange={(checked) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      exocad: {
                        ...prev.exocad,
                        enabled: checked,
                      },
                    }))
                  }
                />
              </div>
              {localConfig.exocad?.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Import Location</Label>
                    <div className="flex gap-2">
                      <Input
                        value={localConfig.exocad?.importLocation}
                        onChange={(e) =>
                          setLocalConfig((prev) => ({
                            ...prev,
                            exocad: {
                              ...prev.exocad,
                              importLocation: e.target.value,
                            },
                          }))
                        }
                      />
                      <Button variant="outline" size="icon">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Generate JSON Files</Label>
                    <Switch
                      checked={localConfig.exocad?.createJson}
                      onCheckedChange={(checked) =>
                        setLocalConfig((prev) => ({
                          ...prev,
                          exocad: {
                            ...prev.exocad,
                            createJson: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Folder Structure Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium">Folder Structure</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Use Practice Folders</Label>
                <Switch
                  checked={localConfig.folderStructure.usePracticeFolders}
                  onCheckedChange={(checked) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      folderStructure: {
                        ...prev.folderStructure,
                        usePracticeFolders: checked,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Use Patient Folders</Label>
                <Switch
                  checked={localConfig.folderStructure.usePatientFolders}
                  onCheckedChange={(checked) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      folderStructure: {
                        ...prev.folderStructure,
                        usePatientFolders: checked,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Use Case Folders</Label>
                <Switch
                  checked={localConfig.folderStructure.useCaseFolders}
                  onCheckedChange={(checked) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      folderStructure: {
                        ...prev.folderStructure,
                        useCaseFolders: checked,
                      },
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Naming Pattern</Label>
                <Input
                  value={localConfig.folderStructure.namingPattern}
                  onChange={(e) =>
                    setLocalConfig((prev) => ({
                      ...prev,
                      folderStructure: {
                        ...prev.folderStructure,
                        namingPattern: e.target.value,
                      },
                    }))
                  }
                  placeholder="{practice}/{patientId}/{caseId}"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}