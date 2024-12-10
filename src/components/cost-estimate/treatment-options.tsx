import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Clock, Truck, Award, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HKPChart } from '@/components/dental-chart/hkp-chart';
import { Badge } from '@/components/ui/badge';
import type { HKPCode } from '@/lib/types/hkp';
import { CoverageLevel, type TreatmentPlan } from '@/lib/cost-estimation/types';

interface TreatmentOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: {
    id: string;
    name: string;
    lab?: string;
  };
  selectedTeeth: string[];
  befunde: Record<string, HKPCode>;
  treatmentOptions: Record<CoverageLevel, TreatmentPlan[]>;
  onBack: () => void;
}

interface CostBreakdownProps {
  treatmentPlan: TreatmentPlan;
}

const mockLabs = [
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
  },
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
];

function CostBreakdown({ treatmentPlan }: CostBreakdownProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.doctorFees')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{treatmentPlan.estimatedCost.toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.labFees')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{(treatmentPlan.estimatedCost * 0.4).toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.subsidy')}
        </h3>
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-lg">
          €{treatmentPlan.festzuschuss.toFixed(2)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t('costEstimate.costs.patientPrice')}
        </h3>
        <div className="h-24 bg-primary/10 rounded-lg flex items-center justify-center text-lg font-medium">
          €{treatmentPlan.patientPortion.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

function LabCard({ lab, selected, onSelect }: any) {
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
    </div>
  );
}

export function TreatmentOptions({
  open,
  onOpenChange,
  patient,
  selectedTeeth,
  befunde,
  treatmentOptions,
  onBack,
}: TreatmentOptionsProps) {
  const { t } = useTranslation();
  const [showLabPrices, setShowLabPrices] = useState(false);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1000px] h-[90vh] flex flex-col">
        <DialogHeader>
          <Button
            variant="ghost"
            className="absolute left-6 top-6"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <DialogTitle className="text-center pt-4">
            {patient.name}{' '}
            <span className="text-muted-foreground">
              ID: {patient.id}
              {patient.lab && ` | Lab: ${patient.lab}`}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6">
            <Tabs defaultValue={CoverageLevel.STANDARD}>
              <TabsList className="w-full">
                <TabsTrigger value={CoverageLevel.STANDARD} className="flex-1">
                  {t('costEstimate.options.option1')}
                </TabsTrigger>
                <TabsTrigger value={CoverageLevel.SAME_TYPE} className="flex-1">
                  {t('costEstimate.options.option2')}
                </TabsTrigger>
                <TabsTrigger value={CoverageLevel.DIFFERENT_TYPE} className="flex-1">
                  {t('costEstimate.options.option3')}
                </TabsTrigger>
              </TabsList>

              {Object.entries(treatmentOptions).map(([level, plans]) => (
                <TabsContent key={level} value={level}>
                  {plans.length > 0 && (
                    <>
                      <HKPChart 
                        befunde={befunde}
                        regelversorgung={plans[0].regelversorgung}
                        therapie={plans[0].therapie}
                        className="mt-6"
                      />
                      <CostBreakdown treatmentPlan={plans[0]} />
                      
                      <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Select Lab</h3>
                          <Button
                            variant="outline"
                            onClick={() => setShowLabPrices(!showLabPrices)}
                            className="flex items-center gap-2"
                          >
                            <Truck className="h-4 w-4" />
                            Compare Labs
                          </Button>
                        </div>
                        
                        {showLabPrices && (
                          <div className="space-y-4">
                            {mockLabs.map((lab) => (
                              <LabCard
                                key={lab.id}
                                lab={lab}
                                selected={selectedLab === lab.id}
                                onSelect={() => setSelectedLab(lab.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </ScrollArea>

        <div className="flex justify-between p-6 border-t bg-background">
          <Button variant="outline">
            {t('common.save')}
          </Button>
          <Button disabled={!selectedLab}>
            {t('common.send')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}