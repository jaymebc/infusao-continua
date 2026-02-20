// exportService.js

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function formatDateTime(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatDateForFilename(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}`;
}

function translateMode(mode) {
    const t = {
        'bolus': 'Bolus',
        'infusion': 'Infus\u00e3o Cont\u00ednua',
        'check-dose': 'Verificar Dose'
    };
    return t[mode] || mode;
}

function buildSinglePage(doc, data, pageIndex, pageTotal) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 15;

    // Cabeçalho
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Calculadora de Infus\u00e3o Cont\u00ednua', pageWidth / 2, y, { align: 'center' });
    y += 4;

    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Indicador de página (só no consolidado)
    if (pageTotal > 1) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(127, 140, 141);
        doc.text(`C\u00e1lculo ${pageIndex} de ${pageTotal}`, pageWidth - margin, y, { align: 'right' });
        y += 6;
    }

    // Bloco de informações
    doc.setFillColor(236, 240, 241);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 32, 2, 2, 'F');
    y += 6;

    const info = [
        ['Data/Hora:', formatDateTime(data.timestamp)],
        ['Medicamento:', data.drugName],
        ['Modo:', translateMode(data.mode)],
        ['Peso do Paciente:', `${data.weight} kg`],
        ['Dose:', `${data.dose || '-'} ${data.doseUnit || ''}`]
    ];

    doc.setFontSize(10);
    info.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(label, margin + 4, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 42, y);
        y += 5.5;
    });

    y += 6;

    // Parâmetros de entrada
    if (data.inputs && data.inputs.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text('Par\u00e2metros de Entrada', margin, y);
        y += 2;
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 4;

        doc.autoTable({
            startY: y,
            head: [['Campo', 'Valor']],
            body: data.inputs.map(i => [i.label, String(i.value)]),
            margin: { left: margin, right: margin },
            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: { fontSize: 10, textColor: [44, 62, 80] },
            alternateRowStyles: { fillColor: [236, 240, 241] },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
            },
            styles: { overflow: 'linebreak', cellPadding: 3 }
        });

        y = doc.lastAutoTable.finalY + 8;
    }

    // Resultados
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Resultados', margin, y);
    y += 2;
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.autoTable({
        startY: y,
        head: [['Par\u00e2metro', 'Valor']],
        body: data.results.map(r => [r.label, String(r.value)]),
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: { fontSize: 10, textColor: [44, 62, 80] },
        alternateRowStyles: { fillColor: [236, 240, 241] },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
        },
        styles: { overflow: 'linebreak', cellPadding: 3 }
    });

    y = doc.lastAutoTable.finalY + 8;

    // Nota de diluição
    if (data.dilutionNote) {
        const noteLines = doc.splitTextToSize(data.dilutionNote, pageWidth - margin * 2 - 10);
        const noteHeight = noteLines.length * 5 + 14;

        if (y + noteHeight > pageHeight - 25) {
            doc.addPage();
            y = 15;
        }

        doc.setFillColor(255, 243, 205);
        doc.roundedRect(margin, y, pageWidth - margin * 2, noteHeight, 2, 2, 'F');
        doc.setDrawColor(255, 193, 7);
        doc.setLineWidth(0.8);
        doc.line(margin, y, margin, y + noteHeight);

        y += 6;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(133, 100, 4);
        doc.text('Instru\u00e7\u00f5es de Preparo', margin + 4, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        noteLines.forEach(line => {
            doc.text(line, margin + 4, y);
            y += 5;
        });
    }

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    doc.setFont('helvetica', 'normal');
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    doc.text(
        'Documento gerado automaticamente pela Calculadora de Infus\u00e3o Cont\u00ednua',
        margin,
        pageHeight - 12
    );
    doc.text(
        'Apenas para refer\u00eancia. Consulte sempre o m\u00e9dico respons\u00e1vel.',
        margin,
        pageHeight - 7
    );
}

// Exporta um único cálculo
export async function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    buildSinglePage(doc, data, 1, 1);

    const filename = `infusao_${data.drugName.replace(/\s+/g, '_')}_${formatDateForFilename(data.timestamp)}.pdf`;

    if (isIOS()) {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
        doc.save(filename);
    }
}

// Exporta múltiplos cálculos em páginas separadas
export async function exportMultipleToPDF(entries) {
    if (!entries || entries.length === 0) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    entries.forEach((entry, index) => {
        if (index > 0) doc.addPage();
        buildSinglePage(doc, entry, index + 1, entries.length);
    });

    const filename = `historico_infusao_${formatDateForFilename(new Date())}.pdf`;

    if (isIOS()) {
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
        doc.save(filename);
    }
}