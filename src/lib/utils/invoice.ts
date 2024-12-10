import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Position } from '@/lib/types/invoice';

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  lab: {
    name: string;
    address: string;
    taxId: string;
    bankDetails: {
      bank: string;
      iban: string;
      bic: string;
    };
  };
  dentist: {
    name: string;
    practice: string;
    address: string;
  };
  patient: {
    id: string;
    name: string;
  };
  positions: Position[];
  notes?: string;
}

export function generateInvoicePDF(data: InvoiceData): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Header with lab info
  doc.setFontSize(10);
  doc.text(data.lab.name, margin, margin);
  doc.text(data.lab.address.split('\n'), margin, margin + 5);

  // Dentist address block
  doc.setFontSize(10);
  doc.text([
    data.dentist.name,
    data.dentist.practice,
    ...data.dentist.address.split('\n')
  ], margin, margin + 30);

  // Invoice details
  doc.setFontSize(16);
  doc.text('Invoice', margin, margin + 60);
  
  doc.setFontSize(10);
  const invoiceDetails = [
    ['Invoice Number:', data.invoiceNumber],
    ['Date:', format(data.date, 'PP')],
    ['Due Date:', format(data.dueDate, 'PP')],
    ['Patient ID:', data.patient.id],
    ['Patient Name:', data.patient.name],
  ];

  doc.text(invoiceDetails.map(([key, value]) => `${key} ${value}`), margin, margin + 70);

  // Positions table
  const tableBody = data.positions.map(pos => [
    pos.code,
    pos.description,
    pos.quantity.toString(),
    `€${pos.price.toFixed(2)}`,
    `€${(pos.quantity * pos.price).toFixed(2)}`,
  ]);

  const total = data.positions.reduce((sum, pos) => sum + (pos.quantity * pos.price), 0);

  autoTable(doc, {
    startY: margin + 100,
    head: [['Code', 'Description', 'Quantity', 'Price', 'Total']],
    body: [
      ...tableBody,
      ['', '', '', 'Total:', `€${total.toFixed(2)}`],
    ],
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [80, 80, 80] },
  });

  // Notes
  if (data.notes) {
    doc.text('Notes:', margin, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(9);
    doc.text(data.notes.split('\n'), margin, doc.lastAutoTable.finalY + 30);
  }

  // Payment details
  const paymentY = doc.lastAutoTable.finalY + (data.notes ? 50 : 20);
  doc.setFontSize(10);
  doc.text('Payment Details:', margin, paymentY);
  doc.setFontSize(9);
  doc.text([
    `Bank: ${data.lab.bankDetails.bank}`,
    `IBAN: ${data.lab.bankDetails.iban}`,
    `BIC: ${data.lab.bankDetails.bic}`,
  ], margin, paymentY + 10);

  // Footer
  doc.setFontSize(8);
  const footer = [
    data.lab.name,
    `Tax ID: ${data.lab.taxId}`,
    data.lab.address,
  ].join(' | ');
  doc.text(footer, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

  return doc.output('blob');
}