import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useLabPricingStore } from '@/stores/lab-pricing-store';
import { BEBCategory } from '@/lib/pricing/types';

export function BEBPricing() {
  const { config, updateBEBPosition, setBEBCustomPrice } = useLabPricingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<BEBCategory | 'all'>('all');

  const filteredPositions = Object.entries(config.bebPositions).filter(
    ([code, position]) =>
      (filter === 'all' || position.category === filter) &&
      (position.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BEB Position Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {Object.values(BEBCategory).map((category) => (
                <Badge
                  key={category}
                  variant={filter === category ? 'default' : 'secondary'}
                  className="cursor-pointer"
                  onClick={() => setFilter(filter === category ? 'all' : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredPositions.map(([code, position]) => (
              <div
                key={code}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{position.code}</h3>
                    <Badge variant="secondary">{position.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {position.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Base Price</Label>
                      <p className="text-sm">€{position.basePrice.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Custom Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={position.customPrice || ''}
                        onChange={(e) =>
                          setBEBCustomPrice(code, parseFloat(e.target.value))
                        }
                        className="w-24 h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Region Factor</Label>
                      <Input
                        type="number"
                        min="0.8"
                        max="1.5"
                        step="0.1"
                        value={position.regionFactor}
                        onChange={(e) =>
                          updateBEBPosition(code, {
                            regionFactor: parseFloat(e.target.value),
                          })
                        }
                        className="w-24 h-8"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={position.enabled}
                    onCheckedChange={(checked) =>
                      updateBEBPosition(code, { enabled: checked })
                    }
                  />
                  <Label>Enabled</Label>
                </div>
              </div>
            ))}

            {filteredPositions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No positions found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}