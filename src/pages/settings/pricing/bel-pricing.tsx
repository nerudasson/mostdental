import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLabPricingStore } from '@/stores/lab-pricing-store';

export function BELPricing() {
  const { config, updateBELPosition } = useLabPricingStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPositions = Object.entries(config.belPositions).filter(
    ([code, position]) =>
      position.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>BEL Position Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {position.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Points</Label>
                      <p className="text-sm">{position.points}</p>
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
                          updateBELPosition(code, {
                            regionFactor: parseFloat(e.target.value),
                          })
                        }
                        className="w-24 h-8"
                      />
                    </div>
                  </div>
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