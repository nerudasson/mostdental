export type HKPCode = 
  | 'f'  // Fehlend
  | 'k'  // Karies
  | 'e'  // Ersetzt
  | 'x'  // Nicht erhaltungswürdig
  | 'w'  // Wurzelrest
  | 'kw' // Karies + Wurzelbehandlung
  | 'ww' // Weisheitszahn
  | 'K'  // Krone
  | 'B'  // Brückenglied
  | 'KB' // Krone als Brückenanker
  | 'PK' // Teilkrone
  | 'V'  // Verblendung
  | 'I'  // Implantat
  | 'IR' // Implantat mit Krone
  | 'TW' // Teleskopkrone
  | 'PW' // Prothesenzahn
  | 'SW' // Interimsprothesenzahn
  | 'KZ' // Vollkeramikkrone (Zirkon)
  | 'KBZ' // Vollkeramische Brückenkrone (Zirkon)
  | 'BZ' // Vollkeramisches Brückenglied (Zirkon)
  | 'E';  // Extraktion

export interface HKPTreatment {
  befund: Record<string, HKPCode>;
  regelversorgung: Record<string, HKPCode>;
  therapie: Record<string, HKPCode>;
}