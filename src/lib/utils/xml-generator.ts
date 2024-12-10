import type { XMLSettings } from '@/lib/types/xml-settings';
import type { CostEstimate } from '@/lib/types/cost-estimate';
import type { Order } from '@/lib/types/order';

export function generateOrderXML(order: Order, settings: XMLSettings): string {
  const manufacturingLocation = settings.manufacturingLocations.find((loc) => loc.isDefault) || 
                              settings.manufacturingLocations[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Auftrag xmlns="http://www.vdzi.de/xmlschnittstelle/v1.0">
  <Kopf>
    <Labor>
      <Firmenname>${settings.companyName}</Firmenname>
      <Abrechnungsnummer>${settings.labId}</Abrechnungsnummer>
      <Abrechnungsbereich>${settings.billingRegion}</Abrechnungsbereich>
    </Labor>
    <Herstellungsort>${manufacturingLocation?.name || ''}</Herstellungsort>
    <Zahnarzt>
      <Name>${order.dentistName}</Name>
      <Praxis>${order.practice}</Praxis>
    </Zahnarzt>
    <Patient>
      <PatientenID>${order.patientId}</PatientenID>
      <Name>${order.patientName}</Name>
    </Patient>
    <Auftragsnummer>${order.id}</Auftragsnummer>
    <Auftragsdatum>${order.createdAt.toISOString().split('T')[0]}</Auftragsdatum>
  </Kopf>
  <Positionen>
    ${generatePositionsXML(order)}
  </Positionen>
</Auftrag>`;

  return xml;
}

export function generateEstimateXML(estimate: CostEstimate, settings: XMLSettings): string {
  const manufacturingLocation = settings.manufacturingLocations.find((loc) => loc.isDefault) || 
                              settings.manufacturingLocations[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Kostenvoranschlag xmlns="http://www.vdzi.de/xmlschnittstelle/v1.0">
  <Kopf>
    <Labor>
      <Firmenname>${settings.companyName}</Firmenname>
      <Abrechnungsnummer>${settings.labId}</Abrechnungsnummer>
      <Abrechnungsbereich>${settings.billingRegion}</Abrechnungsbereich>
    </Labor>
    <Herstellungsort>${manufacturingLocation?.name || ''}</Herstellungsort>
    <Zahnarzt>
      <Name>${estimate.dentist.name}</Name>
      <Praxis>${estimate.dentist.practice}</Praxis>
    </Zahnarzt>
    <Patient>
      <PatientenID>${estimate.patient.id}</PatientenID>
      <Name>${estimate.patient.name}</Name>
    </Patient>
    <KVANummer>${estimate.id}</KVANummer>
    <Erstellungsdatum>${estimate.createdAt.toISOString().split('T')[0]}</Erstellungsdatum>
  </Kopf>
  <Positionen>
    ${generateEstimatePositionsXML(estimate)}
  </Positionen>
</Kostenvoranschlag>`;

  return xml;
}

function generatePositionsXML(order: Order): string {
  // Implementation depends on your position structure
  return '';
}

function generateEstimatePositionsXML(estimate: CostEstimate): string {
  // Implementation depends on your position structure
  return '';
}

export function downloadXML(xml: string, filename: string) {
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}