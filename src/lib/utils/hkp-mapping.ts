import { ProductCategory, MaterialType } from '@/lib/types/product';
import type { HKPCode } from '@/lib/types/hkp';

interface ProductMapping {
  category: ProductCategory;
  defaultMaterial: MaterialType;
  description: string;
}

export const HKP_TO_PRODUCT: Record<HKPCode, ProductMapping> = {
  'k': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Crown for carious tooth'
  },
  'kw': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Crown after root treatment'
  },
  'K': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Standard crown'
  },
  'KB': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Crown as bridge abutment'
  },
  'B': {
    category: ProductCategory.BRIDGE,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Bridge pontic'
  },
  'PK': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Partial crown'
  },
  'V': {
    category: ProductCategory.VENEER,
    defaultMaterial: MaterialType.LITHIUM_DISILICATE,
    description: 'Veneer'
  },
  'I': {
    category: ProductCategory.IMPLANT,
    defaultMaterial: MaterialType.ZIRCONIA,
    description: 'Implant'
  },
  'IR': {
    category: ProductCategory.IMPLANT,
    defaultMaterial: MaterialType.ZIRCONIA,
    description: 'Implant with crown'
  },
  'TW': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Telescopic crown'
  },
  'PW': {
    category: ProductCategory.BRIDGE,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Denture tooth'
  },
  'SW': {
    category: ProductCategory.BRIDGE,
    defaultMaterial: MaterialType.COMPOSITE,
    description: 'Temporary denture tooth'
  },
  'f': {
    category: ProductCategory.BRIDGE,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Missing tooth'
  },
  'e': {
    category: ProductCategory.BRIDGE,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Replaced tooth'
  },
  'x': {
    category: ProductCategory.IMPLANT,
    defaultMaterial: MaterialType.ZIRCONIA,
    description: 'Non-preservable tooth'
  },
  'w': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Root remnant'
  },
  'ww': {
    category: ProductCategory.CROWN,
    defaultMaterial: MaterialType.METAL_CERAMIC,
    description: 'Wisdom tooth'
  }
};

export function getProductRequirements(befunde: Record<string, HKPCode>) {
  const requirements = new Set<ProductCategory>();
  const materials = new Set<MaterialType>();

  Object.values(befunde).forEach(code => {
    const mapping = HKP_TO_PRODUCT[code];
    if (mapping) {
      requirements.add(mapping.category);
      materials.add(mapping.defaultMaterial);
    }
  });

  return {
    categories: Array.from(requirements),
    suggestedMaterials: Array.from(materials)
  };
}