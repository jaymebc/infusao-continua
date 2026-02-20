// exportService.js - Serviço de exportação de dados

export function exportToCSV(data) {
    const { drugName, mode, weight, dose, doseUnit, inputs, results, timestamp } = data;

    let csv = '\uFEFF';
    csv += 'CALCULADORA DE INFUSAO CONTINUA - EXPORTACAO\n';
    csv += `Data/Hora,${formatDateTime(timestamp)}\n`;
    csv += `Medicamento,"${escapeCSV(drugName)}"\n`;
    csv += `Modo,${translateMode(mode)}\n`;
    csv += `Peso (kg),${weight}\n`;
    csv += '\n';

    if (inputs && inputs.length > 0) {
        csv += 'PARAMETROS DE ENTRADA\n';
        csv += 'Campo,Valor\n';
        inputs.forEach(input => {
            csv += `"${escapeCSV(input.label)}","${escapeCSV(input.value)}"\n`;
        });
        csv += '\n';
    }

    csv += 'RESULTADOS\n';
    csv += 'Parametro,Valor\n';
    results.forEach(result => {
        csv += `"${escapeCSV(result.label)}","${escapeCSV(result.value)}"\n`;
    });

    return csv;
}

function escapeCSV(field) {
    if (field === null || field === undefined) return '';
    const fieldStr = String(field);
    if (fieldStr.includes('"') || fieldStr.includes('\n') || fieldStr.includes(',')) {
        return fieldStr.replace(/"/g, '""');
    }
    return fieldStr;
}

export async function exportToPDF(data) {
    const { drugName, mode, weight, dose, doseUnit, inputs, results, dilutionNote, timestamp } = data;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // ✅ CORREÇÃO DE ACENTOS: usar UTF-8 nativo do jsPDF
    doc.setLanguage('pt-BR');

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = 15;

    // Título
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.setFont('helvetica', 'bold');
    doc.text('Calculadora de Infus\u00e3o Cont\u00ednua', pageWidth / 2, y, { align: 'center' });
    y += 4;

    // Linha sob o título
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // Bloco de informações
    doc.setFillColor(236, 240, 241);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 32, 2, 2, 'F');
    y += 6;

    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);

    const info = [
        ['Data/Hora:', formatDateTime(timestamp)],
        ['Medicamento:', drugName],
        ['Modo:', translateMode(mode)],
        ['Peso do Paciente:', `${weight} kg`],
        ['Dose:', `${dose || '-'} ${doseUnit || ''}`]
    ];

    info.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, margin + 4, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(value), margin + 42, y);
        y += 5.5;
    });

    y += 6;

    // ✅ TABELA DE INPUTS (parâmetros de entrada)
    if (inputs && inputs.length > 0) {
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
            body: inputs.map(input => [input.label, String(input.value)]),
            margin: { left: margin, right: margin },
            headStyles: {
                fillColor: [52, 152, 219],
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 10
            },
            bodyStyles: {
                fontSize: 10,
                textColor: [44, 62, 80]
            },
            alternateRowStyles: {
                fillColor: [236, 240, 241]
            },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
            },
            styles: {
                overflow: 'linebreak',
                cellPadding: 3
            }
        });

        y = doc.lastAutoTable.finalY + 8;
    }

    // ✅ TABELA DE RESULTADOS
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
        body: results.map(r => [r.label, String(r.value)]),
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: [52, 152, 219],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 10,
            textColor: [44, 62, 80]
        },
        alternateRowStyles: {
            fillColor: [236, 240, 241]
        },
        columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
        },
        styles: {
            overflow: 'linebreak',
            cellPadding: 3
        }
    });

    y = doc.lastAutoTable.finalY + 8;

    // Bloco dilutionNote
    if (dilutionNote) {
        const noteLines = doc.splitTextToSize(dilutionNote, pageWidth - margin * 2 - 10);
        const noteHeight = noteLines.length * 5 + 14;

        if (y + noteHeight > doc.internal.pageSize.getHeight() - 25) {
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
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(127, 140, 141);
    doc.setFont('helvetica', 'normal');
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
    doc.text('Documento gerado automaticamente pela Calculadora de Infus\u00e3o Cont\u00ednua', margin, pageHeight - 12);
    doc.text('Apenas para refer\u00eancia. Consulte sempre o m\u00e9dico respons\u00e1vel.', margin, pageHeight - 7);

    const filename = `infusao_${drugName.replace(/\s+/g, '_')}_${formatDateForFilename(timestamp)}.pdf`;
    doc.save(filename);
}

export function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
    const translations = {
        'bolus': 'Bolus',
        'infusion': 'Infus\u00e3o Cont\u00ednua',
        'check-dose': 'Verificar Dose'
    };
    return translations[mode] || mode;
}