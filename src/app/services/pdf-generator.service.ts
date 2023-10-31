import { Injectable, OnInit } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatumUser, User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  generateAttendanceReportPDF(studentName: string, attendanceData: any, studentIdToReport: string, totalSessions: number, presentSessions: number, attendancePercentage: string): Promise<any> {
    return new Promise((resolve, reject) => {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

      const docDefinition: any = {
        watermark: { text: '', angle: 70 },
        content: [
          { text: 'Informe de Asistencia', fontSize: 35, bold: true, margin: [0, 0, 0, 20] },
          { text: studentName, fontSize: 24, margin: [0, 0, 0, 10] },
          { text: 'Detalles de asistencia:', fontSize: 17, margin: [0, 20, 0, 10], bold: true },
          { text: this.generateAttendanceSingleDetails(attendanceData, studentIdToReport), fontSize: 15, margin: [0, 0, 0, 10] },
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

  generateAttendanceSingleDetails(attendanceData: any, studentIdToReport: string) {
    const details: any = [];

    attendanceData.forEach((session: any) => {
      const sessionDate = session.date;
      const attendanceStatus = session.studentIds.find((student: any) => student.studentId === studentIdToReport).attendanceStatus;
      details.push(`${sessionDate}: ${attendanceStatus}\n`);
    });

    return details;
  }

  generateAttendanceDetails(attendanceData: any) {
    const details: any = [];

    for (const date in attendanceData) {
      if (attendanceData.hasOwnProperty(date)) {
        const session = attendanceData[date];
        const sessionDate = session.date;
        const attendanceStatus = session.attendanceStatus;
        details.push({ text: `${sessionDate}: ${attendanceStatus}`, fontSize: 12 });
      }
    }

    return details;
  }

  getStudentName(allStudents: any, studentId: string) {
    const student = allStudents.find((student: any) => student.userId === studentId);
    return student?.userName + ' ' + student?.userLastName;
  }

  generateSemesterReportPDF(studentsData: any, allStudents: any): Promise<any> {
    return new Promise((resolve, reject) => {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

      const docDefinition: any = {
        watermark: { text: '', angle: 70 },
        content: [
          { text: 'Informe de Asistencia', fontSize: 35, bold: true, margin: [0, 0, 0, 20] },
          { text: 'Detalles de asistencia por alumno:', fontSize: 17, margin: [0, 20, 0, 10], bold: true },
          this.generateStudentAttendanceTables(studentsData, allStudents)
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
      docDefinition.content[2].style = 'subheader';

      pdfMake.createPdf(docDefinition).getBlob((blob) => {
        resolve(blob);
      });
    });
  }

  generateStudentAttendanceTables(studentsData: any, allStudents: any) {
    const tables: any = [];

    for (const studentId in studentsData) {
      const studentDetails = studentsData[studentId];
      const studentName = this.getStudentName(allStudents, studentId);

      // Crear una tabla para el estudiante
      const studentTable = this.generateStudentTable(studentName, studentDetails);

      tables.push(studentTable);
    }

    return tables;
  }

  generateStudentTable(studentName: string, studentDetails: any) {
    const table: any = {
      table: {
        headerRows: 1,
        widths: ['auto', 'auto', 'auto'],
        body: [
          [{ text: 'Nombre', style: 'tableHeader' }, { text: 'Asignatura', style: 'tableHeader' }, { text: 'Porcentaje de Asistencia', style: 'tableHeader' }]
        ]
      },
      layout: 'lightHorizontalLines',
    };

    for (const subject in studentDetails) {
      if (subject !== 'studentName' && studentDetails.hasOwnProperty(subject)) {
        const subjectData = studentDetails[subject];
        const attendancePercentage = this.calculateAttendancePercentage(subjectData);

        table.table.body.push([studentName, subject, attendancePercentage]);
      }
    }

    return table;
  }

  calculateAttendancePercentage(subjectData: any) {
    const totalSessions = subjectData.length;
    const presentSessions = subjectData.filter((session: any) => session.attendanceStatus === 'Presente').length;
    const percentage = (presentSessions / totalSessions) * 100;
    return percentage.toFixed(2) + '%';
  }
}
