import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor() { }

  generateAttendanceReportPDF(studentName: string, attendanceData: any, studentIdToReport: string, totalSessions: string, presentSessions: string, attendancePercentage: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

      const docDefinition: any = {
        watermark: { text: 'No valido para comerse un completo', angle: 70 },
        content: [
          { text: 'Informe de Asistencia', fontSize: 35, bold: true, margin: [0, 0, 0, 20] },
          { text: studentName, fontSize: 24, margin: [0, 0, 0, 10] },
          { text: 'Detalles de asistencia:', fontSize: 17, margin: [0, 20, 0, 10], bold: true },
          { text: this.generateAttendanceDetails(attendanceData, studentIdToReport), fontSize: 15, margin: [0, 0, 0, 10] },
          { text: 'Información adicional:', fontSize: 17, margin: [0, 20, 0, 10], bold: true },
          { text: `Total de sesiones: ${totalSessions}`, fontSize: 15, margin: [0, 0, 0, 10] },
          { text: `Asistencias: ${presentSessions}`, fontSize: 15, margin: [0, 0, 0, 10] },
          { text: `Porcentaje de asistencia: ${attendancePercentage}`, fontSize: 15, margin: [0, 0, 0, 10] }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 10],
          },
        },
      };

      docDefinition.content[0].style = 'header';
      docDefinition.content[3].style = 'subheader';
      docDefinition.content[5].style = 'subheader';
      docDefinition.content[6].style = 'subheader';
      docDefinition.content[7].style = 'subheader';


      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        resolve(blob);
      });
    });
  }

  generateAttendanceDetails(attendanceData: any, studentIdToReport: string) {
    const details: any = [];

    attendanceData.forEach((session: any) => {
      const sessionDate = session.date;
      const attendanceStatus = session.studentIds.find((student: any) => student.studentId === studentIdToReport).attendanceStatus;
      details.push(`${sessionDate}: ${attendanceStatus}\n`);
    });

    return details;
  }
}
