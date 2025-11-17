/* ====================================
   MÓDULO DE EXPORTACIÓN A PDF
   ==================================== */

const PDFExport = {
    generate() {
        if (App.data.registros.length === 0) {
            App.toast('⚠️ No hay datos para exportar', 'warning');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('landscape');

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;

        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(0, 123, 255);
        doc.text('Sistema de Gestión de Control UMP', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Reporte generado: ${new Date().toLocaleString('es-CL')}`, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 15;

        // Estadísticas resumen
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Resumen General', 14, yPos);
        
        yPos += 8;
        doc.setFontSize(10);
        
        const stats = PDFExport.getStats();
        const statsText = [
            `Total de Controles: ${stats.totalControles}`,
            `Total de Vehículos Controlados: ${stats.totalVehiculos.toLocaleString('es-CL')}`,
            `Total Sobrepeso: ${stats.totalSobrepeso.toLocaleString('es-CL')} (${stats.porcentajeSobrepeso}%)`,
            `Total Infracciones: ${stats.totalInfracciones.toLocaleString('es-CL')} (${stats.porcentajeInfracciones}%)`
        ];

        statsText.forEach(text => {
            doc.text(text, 14, yPos);
            yPos += 6;
        });

        yPos += 10;

        // Tabla de datos
        const tableData = App.data.registros.map(r => [
            r.fecha,
            r.region,
            r.puntoControl,
            r.horaInicio && r.horaFin ? `${r.horaInicio}-${r.horaFin}` : 'N/A',
            r.horasFormato,
            r.vehiculosControlados,
            r.vehiculosSobrepeso,
            r.vehiculosInfraccionados,
            `${r.porcentajeSobrepeso}%`,
            `${r.porcentajeInfraccion}%`
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Fecha', 'Región', 'Punto', 'Horario', 'Horas', 'Ctrl', 'Sobre', 'Infrac', '%S', '%I']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 123, 255],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
                const pageNumber = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Página ${data.pageNumber}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
        });

        // Nueva página con observaciones si existen
        const registrosConObs = App.data.registros.filter(r => r.observaciones);
        
        if (registrosConObs.length > 0) {
            doc.addPage();
            yPos = 20;
            
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Observaciones de Controles', 14, yPos);
            yPos += 10;
            
            registrosConObs.forEach(r => {
                if (yPos > pageHeight - 30) {
                    doc.addPage();
                    yPos = 20;
                }

                doc.setFontSize(10);
                doc.setTextColor(0, 123, 255);
                doc.text(`${r.fecha} - ${r.puntoControl}`, 14, yPos);
                yPos += 6;
                
                doc.setFontSize(9);
                doc.setTextColor(100);
                const lines = doc.splitTextToSize(r.observaciones, pageWidth - 28);
                doc.text(lines, 14, yPos);
                yPos += (lines.length * 5) + 8;
            });
        }

        doc.save(`reporte_controles_${new Date().toISOString().split('T')[0]}.pdf`);
        App.toast('✅ PDF generado con observaciones', 'success');
    },

    getStats() {
        const totalControles = App.data.registros.length;
        const totalVehiculos = App.data.registros.reduce((sum, r) => sum + r.vehiculosControlados, 0);
        const totalSobrepeso = App.data.registros.reduce((sum, r) => sum + r.vehiculosSobrepeso, 0);
        const totalInfracciones = App.data.registros.reduce((sum, r) => sum + r.vehiculosInfraccionados, 0);

        return {
            totalControles,
            totalVehiculos,
            totalSobrepeso,
            totalInfracciones,
            porcentajeSobrepeso: totalVehiculos > 0 ? ((totalSobrepeso / totalVehiculos) * 100).toFixed(2) : 0,
            porcentajeInfracciones: totalVehiculos > 0 ? ((totalInfracciones / totalVehiculos) * 100).toFixed(2) : 0
        };
    }
};