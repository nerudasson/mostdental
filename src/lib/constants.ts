export const HKP_CODES = {
  // Befund codes
  'f': 'Fehlend',
  'k': 'Karies',
  'e': 'Ersetzt',
  'x': 'Nicht erhaltungswürdig',
  'w': 'Wurzelrest',
  'kw': 'Karies + Wurzelbehandlung',
  'ww': 'Weisheitszahn',
  
  // Treatment codes
  'K': 'Krone',
  'B': 'Brückenglied',
  'KB': 'Krone als Brückenanker',
  'PK': 'Teilkrone',
  'V': 'Verblendung',
  'I': 'Implantat',
  'IR': 'Implantat mit Krone',
  'TW': 'Teleskopkrone',
  'PW': 'Prothesenzahn',
  'SW': 'Interimsprothesenzahn',
} as const;

export type HKPCode = keyof typeof HKP_CODES;