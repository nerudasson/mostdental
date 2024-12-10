import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useScannerIntegration } from '@/lib/scanner/hooks/use-scanner-integration';
import type { ScannerType } from '@/lib/scanner/types';

interface ScannerConnectionFormProps {
  type: ScannerType;
  fields: {
    label: string;
    key: string;
    type: string;
    required?: boolean;
  }[];
  onSuccess?: () => void;
}

export function ScannerConnectionForm({
  type,
  fields,
  onSuccess
}: ScannerConnectionFormProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const { connect, connecting } = useScannerIntegration(type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await connect(credentials);
    if (success) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-destructive">*</span>}
          </Label>
          <Input
            type={field.type}
            value={credentials[field.key] || ''}
            onChange={(e) => setCredentials(prev => ({
              ...prev,
              [field.key]: e.target.value
            }))}
            required={field.required}
          />
        </div>
      ))}

      <Button type="submit" disabled={connecting}>
        {connecting ? 'Connecting...' : 'Connect'}
      </Button>
    </form>
  );
}