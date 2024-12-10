import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, Settings2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { IndicationType } from '@/lib/scanner/types';

interface IndicationMappingProps {
  connectedSoftware: {
    id: string;
    name: string;
    type: 'threeshape' | 'exocad';
    version: string;
  }[];
}

const INDICATIONS = [
  { type: IndicationType.CROWN, label: 'Crown', icon: '👑' },
  { type: IndicationType.BRIDGE, label: 'Bridge', icon: '🌉' },
  { type: IndicationType.INLAY, label: 'Inlay', icon: '🔲' },
  { type: IndicationType.ONLAY, label: 'Onlay', icon: '🔳' },
  { type: IndicationType.VENEER, label: 'Veneer', icon: '🦷' },
  { type: IndicationType.IMPLANT, label: 'Implant', icon: '🔧' },
];

export function IndicationMapping({ connectedSoftware }: IndicationMappingProps) {
  const [mappings, setMappings] = useState<Record<IndicationType, {
    enabled: boolean;
    software: string;
    autoProcess: boolean;
  }>>({
    [IndicationType.CROWN]: { enabled: true, software: '', autoProcess: true },
    [IndicationType.BRIDGE]: { enabled: true, software: '', autoProcess: true },
    [IndicationType.INLAY]: { enabled: false, software: '', autoProcess: false },
    [IndicationType.ONLAY]: { enabled: false, software: '', autoProcess: false },
    [IndicationType.VENEER]: { enabled: true, software: '', autoProcess: true },
    [IndicationType.IMPLANT]: { enabled: true, software: '', autoProcess: false },
  });

  const handleToggleIndication = (type: IndicationType) => {
    setMappings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        enabled: !prev[type].enabled
      }
    }));
  };

  const handleSoftwareChange = (type: IndicationType, softwareId: string) => {
    setMappings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        software: softwareId
      }
    }));
  };

  const handleAutoProcessToggle = (type: IndicationType) => {
    setMappings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        autoProcess: !prev[type].autoProcess
      }
    }));
  };

  if (connectedSoftware.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please connect at least one design software to configure indication mappings.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Indication Mappings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {INDICATIONS.map(({ type, label, icon }) => (
            <div key={type} className="flex items-start justify-between border-b pb-4 last:border-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <Label className="text-base font-medium">{label}</Label>
                  <Switch
                    checked={mappings[type].enabled}
                    onCheckedChange={() => handleToggleIndication(type)}
                  />
                </div>
                {mappings[type].enabled && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {mappings[type].autoProcess ? 'Auto-process' : 'Manual review'}
                    </Badge>
                  </div>
                )}
              </div>

              {mappings[type].enabled && (
                <div className="space-y-2 min-w-[200px]">
                  <Select
                    value={mappings[type].software}
                    onValueChange={(value) => handleSoftwareChange(type, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select software" />
                    </SelectTrigger>
                    <SelectContent>
                      {connectedSoftware.map((software) => (
                        <SelectItem key={software.id} value={software.id}>
                          {software.name} ({software.version})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">
                      Auto-process
                    </Label>
                    <Switch
                      checked={mappings[type].autoProcess}
                      onCheckedChange={() => handleAutoProcessToggle(type)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end">
            <Button>Save Mappings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}