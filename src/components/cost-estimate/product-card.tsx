import { Star, Heart, Share2, Clock, Check } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from '@/lib/types/product';

interface ProductCardProps {
  product: Product;
  onSelect: () => void;
  selected?: boolean;
}

export function ProductCard({ product, onSelect, selected }: ProductCardProps) {
  const effectivePrice = product.discountAmount 
    ? product.basePrice - product.discountAmount
    : product.basePrice;

  return (
    <Card className={`w-full transition-shadow hover:shadow-lg ${selected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left side with image and rating */}
          <div className="w-full lg:w-1/4">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl}
                alt={product.name}
                className="rounded-lg mb-3 w-full object-cover h-48 lg:h-auto hidden lg:block"
              />
            ) : (
              <div className="rounded-lg mb-3 w-full h-48 lg:h-[200px] bg-muted hidden lg:block" />
            )}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-primary text-primary'
                      : 'fill-muted text-muted'
                  }`} 
                />
              ))}
              <span className="ml-2 text-muted-foreground">{product.reviewCount}</span>
            </div>
          </div>

          {/* Middle section with details */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Delivery Time and Manufacturing Type */}
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{product.deliveryDays} Werktage</span>
              </div>
              <Badge variant="secondary">{product.manufacturingType}</Badge>
              <Badge variant="secondary">{product.manufacturingLocation}</Badge>
            </div>

            {/* Features */}
            <div className="mt-6 space-y-3">
              {product.features.filter(f => f.included).map((feature) => (
                <div key={feature.id} className="flex items-start sm:items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium">{feature.name}</span>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side with price */}
          <div className="w-full lg:w-1/4 mt-4 lg:mt-0">
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Sehr gut {product.rating.toFixed(1)}
              </Badge>
              <div className="text-right">
                <div className="text-3xl font-bold">{product.basePrice.toFixed(2)} €</div>
                <div className="text-sm text-muted-foreground">Preis pro Einheit</div>
              </div>
            </div>
            
            {product.discountAmount && (
              <>
                <div className="mt-2 text-right">
                  <span className="text-green-600 font-medium">
                    {product.discountLabel || `${product.discountAmount.toFixed(2)} € Rabatt`}
                  </span>
                </div>
                <div className="text-xl font-bold text-green-600 mt-1 text-right">
                  effektiv {effectivePrice.toFixed(2)} €
                </div>
              </>
            )}

            <Button 
              className="w-full mt-4" 
              onClick={onSelect}
              variant={selected ? "secondary" : "default"}
            >
              {selected ? "Ausgewählt" : "Auswählen"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}