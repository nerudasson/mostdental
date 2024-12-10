import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Clock, Award, Check, Link as LinkIcon } from 'lucide-react';

const mockConnectedLabs = [
  {
    id: '1',
    name: 'Best Lab',
    price: 450,
    rating: 4.8,
    reviews: 124,
    location: 'Berlin',
    deliveryDays: 5,
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=100&h=100',
    features: ['Premium Materials', 'Express Service Available', 'Digital Workflow'],
    certifications: ['ISO 9001', 'MDR Certified'],
    lastOrder: '2024-01-15',
    ordersCount: 45,
  },
  {
    id: '2',
    name: 'Premium Dental',
    price: 520,
    rating: 4.9,
    reviews: 89,
    location: 'Munich',
    deliveryDays: 4,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=100&h=100',
    features: ['Zirconia Specialist', 'Same-day Available', 'Free Shipping'],
    certifications: ['ISO 13485', 'FDA Registered'],
    lastOrder: '2024-02-01',
    ordersCount: 23,
  },
];

const mockNewLabs = [
  {
    id: '3',
    name: 'City Lab',
    price: 480,
    rating: 4.7,
    reviews: 156,
    location: 'Hamburg',
    deliveryDays: 6,
    image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80&w=100&h=100',
    features: ['Color Matching Expert', 'Weekend Service', 'Satisfaction Guarantee'],
    certifications: ['CE Certified', 'DIN EN Certified'],
  },
  {
    id: '4',
    name: 'Digital Dental',
    price: 495,
    rating: 4.6,
    reviews: 78,
    location: 'Frankfurt',
    deliveryDays: 5,
    image: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80&w=100&h=100',
    features: ['Full Digital Workflow', '3D Printing', 'Express Service'],
    certifications: ['ISO 9001', 'CE Certified'],
  },
];

interface LabSelectionProps {
  selectedLab: string | null;
  onLabSelect: (labId: string) => void;
}

function LabCard({ lab, selected, onSelect, isConnected = false }: any) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-primary' : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(lab.id)}
    >
      <div className="flex items-start gap-4">
        <img
          src={lab.image}
          alt={lab.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{lab.name}</h3>
                {isConnected && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm ml-1">{lab.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({lab.reviews} reviews)
                </span>
                <span className="text-sm text-muted-foreground">
                  • {lab.location}
                </span>
              </div>
              {isConnected && (
                <div className="text-sm text-muted-foreground mt-1">
                  {lab.ordersCount} orders • Last order: {new Date(lab.lastOrder).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">€{lab.price}</div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {lab.deliveryDays} days
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-2">
              {lab.features.map((feature: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Check className="h-3 w-3" />
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {lab.certifications.map((cert: string, index: number) => (
              <Badge
                key={index}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Award className="h-3 w-3" />
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function LabSelection({ selectedLab, onLabSelect }: LabSelectionProps) {
  const [activeTab, setActiveTab] = useState('connected');

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="connected" className="flex-1">
            Connected Labs ({mockConnectedLabs.length})
          </TabsTrigger>
          <TabsTrigger value="new" className="flex-1">
            New Labs ({mockNewLabs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {mockConnectedLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              selected={selectedLab === lab.id}
              onSelect={onLabSelect}
              isConnected={true}
            />
          ))}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {mockNewLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              selected={selectedLab === lab.id}
              onSelect={onLabSelect}
              isConnected={false}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}