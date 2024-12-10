import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCostEstimation } from '@/hooks/use-cost-estimation';
import { InsuranceType, CoverageLevel } from '@/lib/imports/types';
import { CostCalculation } from '@/components/cost-estimate/treatment-options/cost-calculation';
import { DetailPanel } from '@/components/cost-estimate/treatment-options/detail-panel';
import { ProductSelection } from '@/components/cost-estimate/treatment-options/product-selection';
import { HKPChart } from '@/components/dental-chart/hkp-chart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTreatmentPlanStore } from '@/stores/treatment-plans';
import type { Product } from '@/lib/types/product';

export function TreatmentOptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state } = location as { state: any };
  const [selectedDetail, setSelectedDetail] = useState<'honorar' | 'labor' | 'patient' | null>(null);
  const [selectedOption, setSelectedOption] = useState(CoverageLevel.STANDARD);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const saveDraft = useTreatmentPlanStore((state) => state.saveDraft);

  // Initialize cost estimation with state from previous page
  const {
    befunde,
    treatmentOptions,
    gozFactor,
    updateGozFactor,
    calculateOptions,
  } = useCostEstimation({
    initialBefunde: state?.befunde,
    insuranceType: InsuranceType.PUBLIC,
    bonusYears: state?.bonusYears || 10,
    hasAdditionalInsurance: false,
  });

  // Calculate options when component mounts
  useEffect(() => {
    if (!treatmentOptions && Object.keys(befunde).length > 0) {
      calculateOptions();
    }
  }, [befunde]);

  // Redirect if no state is present
  if (!state?.patient) {
    navigate('/');
    return null;
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSaveDraft = () => {
    const currentPlan = treatmentOptions[selectedOption]?.[0];
    if (!currentPlan || !selectedProduct) return;

    try {
      // Save draft with current state
      saveDraft({
        patientId: state.patient.id,
        patientName: state.patient.name,
        plan: currentPlan,
        gozFactor,
        selectedLab: selectedProduct.labId,
      });

      toast({
        title: "Draft Saved",
        description: "Your treatment plan has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendToLab = () => {
    if (!selectedProduct) {
      toast({
        title: "Product Required",
        description: "Please select a product before sending the treatment plan.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Plan Sent",
      description: "Treatment plan has been sent to the lab for cost estimation.",
    });
    navigate('/estimates');
  };

  // Show loading state while calculating
  if (!treatmentOptions) {
    return <div>Calculating options...</div>;
  }

  const currentPlan = treatmentOptions[selectedOption]?.[0];
  if (!currentPlan) return null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Treatment Options</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <Tabs value={selectedOption} onValueChange={(value) => setSelectedOption(value as CoverageLevel)}>
        <TabsList className="w-full">
          <TabsTrigger value={CoverageLevel.STANDARD}>
            Standard (NEM)
          </TabsTrigger>
          <TabsTrigger value={CoverageLevel.SAME_TYPE}>
            Premium (Ceramic)
          </TabsTrigger>
          <TabsTrigger value={CoverageLevel.DIFFERENT_TYPE}>
            Implant
          </TabsTrigger>
        </TabsList>

        {Object.values(CoverageLevel).map((level) => (
          <TabsContent key={level} value={level}>
            {/* HKP Chart */}
            <div className="border rounded-lg p-6 mb-6">
              <HKPChart
                befunde={befunde}
                regelversorgung={treatmentOptions[level]?.[0].regelversorgung}
                therapie={treatmentOptions[level]?.[0].therapie}
              />
            </div>

            {/* Product Selection */}
            <div className="border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Select Product</h2>
              <ProductSelection
                category={currentPlan.name}
                selectedProductId={selectedProduct?.id}
                onProductSelect={handleProductSelect}
              />
            </div>

            {/* Cost Calculation and Details */}
            <div className="grid grid-cols-2 gap-6 border rounded-lg">
              <CostCalculation
                treatmentPlan={treatmentOptions[level]?.[0]}
                onDetailSelect={setSelectedDetail}
                selectedDetail={selectedDetail}
              />
              <DetailPanel
                selectedDetail={selectedDetail}
                treatmentPlan={treatmentOptions[level]?.[0]}
                gozFactor={gozFactor}
                onGozFactorChange={updateGozFactor}
                selectedProduct={selectedProduct}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
        <Button onClick={handleSendToLab} disabled={!selectedProduct}>
          Send to Lab
        </Button>
      </div>
    </div>
  );
}