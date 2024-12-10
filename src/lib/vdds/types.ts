import { z } from 'zod';

export enum BefundStatus {
  A_BRIDGE = 'a',        // Adhäsivbrücke (Anker, Spanne)
  B_PONTIC = 'b',        // vorhandenes Brückenglied
  E_REPLACED = 'e',      // bereits ersetzter Zahn
  EW_RENEWAL = 'ew',     // ersetzter, aber erneuerungsbedürftiger Zahn
  F_MISSING = 'f',       // fehlender Zahn
  I_IMPLANT = 'i',       // vorhandenes Implantat mit intakter Suprakonstruktion
  IX_REMOVE = 'ix',      // zu entfernendes Implantat
  K_CROWN = 'k',         // vorhandene klinisch intakte Krone
  KW_CROWN_RENEW = 'kw', // erneuerungsbedürftige Krone
  PW_PARTIAL = 'pw',     // erhaltungswürdiger Zahn mit partiellen Substanzdefekten
  R_ROOT_CAP = 'r',      // vorhandene Wurzelstiftkappe
  RW_ROOT_RENEW = 'rw',  // erneuerungsbedürftige Wurzelstiftkappe
  SW_SUPRA_RENEW = 'sw', // erneuerungsbedürftige Suprakonstruktion
  T_TELESCOPIC = 't',    // vorhandenes Teleskop
  TW_TELE_RENEW = 'tw',  // erneuerungsbedürftiges Teleskop
  UR_RETENTION = 'ur',   // unzureichende Retention
  WW_EXTENSIVE = 'ww',   // erhaltungswürdiger Zahn mit weitgehender Zerstörung
  X_NONVIABLE = 'x',     // nicht erhaltungswürdiger Zahn
  GAP_CLOSURE = ')(',    // Lückenschluss
}

export enum PlanungStatus {
  A = 'A',    // Adhäsivbrücke (Anker, Spanne)
  B = 'B',    // Brückenglied
  E = 'E',    // zu ersetzender Zahn
  H = 'H',    // kompl. gegossene Halte- und Stützvorrichtung
  K = 'K',    // Krone
  M = 'M',    // Vollkeramische oder keramisch vollverblendete Restauration
  L = 'L',    // aufgebrannte keramische Schulter
  O = 'O',    // Geschiebe, Steg etc.
  PK = 'PK',  // Teilkrone
  R = 'R',    // Wurzelstiftkappe
  S = 'S',    // Implantatgetragene Suprakonstruktion
  T = 'T',    // Teleskopkrone
  V = 'V',    // Vestibuläre Verblendung
}

export const vddsPatientSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.date(),
  insurance: z.object({
    type: z.enum(['public', 'private']),
    provider: z.string(),
    number: z.string(),
    bonusYears: z.number().optional(),
  }),
  befunde: z.record(z.string(), z.nativeEnum(BefundStatus)),
  lastVisit: z.date().optional(),
  nextVisit: z.date().optional(),
});

export type VDDSPatient = z.infer<typeof vddsPatientSchema>;

export interface BefundMapping {
  description: string;
  hkpCodes: string[];
  priority: number;
  requiresSurfaces: boolean;
}

export interface VDDSConfig {
  host: string;
  port: number;
  timeout: number;
  practice: {
    id: string;
    name: string;
  };
}