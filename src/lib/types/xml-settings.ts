export interface XMLSettings {
  companyName: string;        // XML Firmenname
  labId: string;             // XML Labor ID (Abrechnungsnummer)
  manufacturingLocations: Array<{
    id: string;
    name: string;            // e.g. "D-Hamburg" for Germany, "China" for foreign
    isDefault: boolean;
  }>;
  billingRegion: BillingRegion;  // Abrechnungsbereich
  nemUnitPrice: number;      // XML NEM Preis je Einheit
}

export enum BillingRegion {
  BE = "BE",   // Berlin
  BBG = "BBG", // Brandenburg
  BW = "BW",   // Baden-Württemberg
  BY = "BY",   // Bayern
  HB = "HB",   // Bremen
  HH = "HH",   // Hamburg
  HS = "HS",   // Hessen
  MVO = "MVO", // Mecklenburg-Vorpommern
  NR = "NR",   // Nordrhein
  NS = "NS",   // Niedersachsen
  RP = "RP",   // Rheinland-Pfalz
  SAA = "SAA", // Saarland
  SA = "SA",   // Sachsen
  SAN = "SAN", // Sachsen-Anhalt
  SH = "SH",   // Schleswig-Holstein
  TH = "TH",   // Thüringen
  WL = "WL",   // Westfalen-Lippe
}

export const BILLING_REGION_LABELS: Record<BillingRegion, string> = {
  BE: "Berlin",
  BBG: "Brandenburg",
  BW: "Baden-Württemberg",
  BY: "Bayern",
  HB: "Bremen",
  HH: "Hamburg",
  HS: "Hessen",
  MVO: "Mecklenburg-Vorpommern",
  NR: "Nordrhein",
  NS: "Niedersachsen",
  RP: "Rheinland-Pfalz",
  SAA: "Saarland",
  SA: "Sachsen",
  SAN: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
  WL: "Westfalen-Lippe",
};