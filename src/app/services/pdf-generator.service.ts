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
          { text: 'Informe de Asistencia' },
          `Estudiante: ${studentName}`,
          { text: 'Detalles de asistencia:' },
          this.generateAttendanceDetails(attendanceData, studentIdToReport),
          { text: 'Información adicional:' },
          'Total de sesiones: ' + totalSessions,
          'Asistencias: ' + presentSessions,
          'Porcentaje de asistencia: ' + attendancePercentage,
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
      details.push(`${sessionDate}: ${attendanceStatus}`);
    });

    return details;
  }
}
