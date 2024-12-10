import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import { format } from 'date-fns';
import { useAppointmentSchedules } from '@/stores/appointment-schedules';
import type { Order } from '@/lib/types/order';

interface PrintoutOptions {
  showCost?: boolean;
  showSignature?: boolean;
  includeBarcode?: boolean;
}

export function generateLabPrintout(order: Order, options: PrintoutOptions = {}): Blob {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Add barcode
  if (options.includeBarcode !== false) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, order.id, {
      format: 'CODE128',
      width: 2,
      height: 50,
      displayValue: true,
    });
    doc.addImage(canvas.toDataURL(), 'PNG', margin, margin, 80, 20);
  }

  // Add reference number and phone
  doc.setFontSize(12);
  doc.text(`Ref# ${order.id}`, margin, margin + 30);
  doc.text(`Tel# ${order.dentistPhone || ''}`, pageWidth - margin - 60, margin + 30);

  // Add dentist name
  doc.setFontSize(16);
  doc.text(order.dentistName, margin, margin + 45);

  // Add dates
  doc.setFontSize(12);
  const dates = [
    ['Ship Date', format(order.createdAt, 'MM/dd/yyyy')],
    ['Client Due Date', format(order.dueDate, 'MM/dd/yyyy')],
  ];
  doc.text(dates.map(([key, value]) => `${key}: ${value}`), margin, margin + 60);

  // Add patient name
  doc.setFontSize(14);
  doc.text(order.patientName, margin, margin + 80);

  // Add tooth units table
  const tableData = order.treatment.teeth.map(tooth => ({
    tooth: tooth,
    restoration: order.treatment.type,
    shade: order.treatment.shade || '',
    design: order.treatment.design || '',
    features: order.treatment.features || '',
  }));

  doc.autoTable({
    startY: margin + 90,
    head: [['Tooth #', 'Restoration', 'Shade', 'Design', 'Additional Features']],
    body: tableData.map(row => [
      row.tooth,
      row.restoration,
      row.shade,
      row.design,
      row.features,
    ]),
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [80, 80, 80] },
  });

  // Add appointment schedule if available
  const { appointments, schedules } = useAppointmentSchedules.getState();
  const orderAppointments = appointments.filter(a => a.orderId === order.id);
  
  if (orderAppointments.length > 0) {
    const schedule = schedules.find(s => s.id === orderAppointments[0].scheduleId);
    if (schedule) {
      const appointmentY = doc.lastAutoTable.finalY + 20;
      
      doc.setFontSize(12);
      doc.text('Production Schedule:', margin, appointmentY);
      
      const appointmentData = orderAppointments.map(appointment => {
        const step = schedule.steps.find(s => s.id === appointment.stepId);
        return [
          step?.name || '',
          format(appointment.scheduledDate, 'MM/dd/yyyy'),
          `${step?.duration} min`,
          appointment.status,
        ];
      });

      doc.autoTable({
        startY: appointmentY + 10,
        head: [['Step', 'Date', 'Duration', 'Status']],
        body: appointmentData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [80, 80, 80] },
      });
    }
  }

  // Add doctor preferences box
  const preferencesY = doc.lastAutoTable.finalY + 20;
  doc.rect(pageWidth - margin - 100, preferencesY, 100, 80);
  doc.setFontSize(10);
  doc.text('Doctor Preferences:', pageWidth - margin - 95, preferencesY + 10);
  
  const preferences = [
    'Fixed',
    'Custom Preference',
    'Use .5 metal collar on lingual if not enough room for porcelain',
    'Contact me if questionable',
  ];
  
  preferences.forEach((pref, index) => {
    doc.text('• ' + pref, pageWidth - margin - 95, preferencesY + 20 + (index * 10));
  });

  // Add contact information
  const contactY = doc.lastAutoTable.finalY + 120;
  doc.setFontSize(10);
  
  // Client contact
  doc.text('Client Contact:', margin, contactY);
  doc.text([
    order.practice,
    order.practiceAddress || '',
    order.dentistPhone || '',
  ], margin, contactY + 10);

  // Lab contact
  doc.text('Lab Contact:', pageWidth - margin - 80, contactY);
  doc.text([
    order.lab?.name || '',
    order.lab?.address || '',
    order.lab?.phone || '',
  ], pageWidth - margin - 80, contactY + 10);

  // Add cost if enabled
  if (options.showCost) {
    doc.text(
      `Estimated Case Cost: €${order.totalCost.toFixed(2)}`,
      margin,
      contactY + 40
    );
  }

  // Add signature line if enabled
  if (options.showSignature) {
    doc.line(margin, contactY + 60, margin + 80, contactY + 60);
    doc.text("Doctor's Signature:", margin, contactY + 70);
    doc.text("License #:", margin, contactY + 80);
  }

  // Add page number
  doc.setFontSize(8);
  doc.text(`Page 1`, pageWidth - margin - 20, doc.internal.pageSize.height - 10);

  return doc.output('blob');
}