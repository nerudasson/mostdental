import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Field {
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string; }[];
}

interface IntegrationCardProps {
  title: string;
  description: string;
  status: 'connected' | 'disconnected';
  connectUrl?: string;
  documentationUrl?: string;
  guideKey: string;
  fields: Field[];
  onConnect?: (values: Record<string, string>) => void;
}

export function IntegrationCard({
  title,
  description,
  status,
  connectUrl,
  documentationUrl,
  guideKey,
  fields,
  onConnect,
}: IntegrationCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect?.(values);
    setShowForm(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {documentationUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={documentationUrl} target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            </Button>
          )}
          {status === 'disconnected' && (
            <Button size="sm" onClick={() => setShowForm(true)}>
              Connect
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-2">
              <Label>
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.type === 'select' ? (
                <Select
                  value={values[field.label] || ''}
                  onValueChange={(value) =>
                    setValues((prev) => ({ ...prev, [field.label]: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  value={values[field.label] || ''}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                  }
                  required={field.required}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Connect</Button>
          </div>
        </form>
      )}
    </Card>
  );
}