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

      const docDefinition = {
        content: [
          { text: 'Informe de Asistencia', fontSize: 35, bold: true },
          { text: `${studentName}`, fontSize: 24 },
          { text: 'Detalles de asistencia:', fontSize: 17 },
          { text: `${this.generateAttendanceDetails(attendanceData, studentIdToReport)}`, fontSize: 15 },
          { text: 'Información adicional:', fontSize: 15 },
          { text: `Total de sesiones: ${totalSessions}`, fontSize: 15 },
          { text: `Asistencias: ${presentSessions}`, fontSize: 15 },
          { text: `Porcentaje de asistencia: ${attendancePercentage}`, fontSize: 15 }
        ]
      };

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
