import { Star, Clock, Award, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Lab {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  deliveryDays: number;
  image: string;
  features: string[];
  certifications: string[];
}

interface LabCardProps {
  lab: Lab;
  selected: boolean;
  onSelect: () => void;
}

export function LabCard({ lab, selected, onSelect }: LabCardProps) {
  return (
    <div 
      className={`relative flex flex-col bg-card rounded-lg border p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
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
              <h3 className="font-medium">{lab.name}</h3>
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
              {lab.features.map((feature, index) => (
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
            {lab.certifications.map((cert, index) => (
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
    </div>
  );
}