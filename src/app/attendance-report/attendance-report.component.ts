import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
  attendanceData: any;
  blobPdf: any;
  // Selected Student
  studentIdToReport = '215783537';

  constructor(private attendance: AttendanceService, private pdfGeneratorService: PdfGeneratorService) {
  }

  ngOnInit() {
    this.attendance.getAllAttendances().subscribe({
      next: (response) => {
        this.attendanceData = response;
      }
    });

  }

  generateAttendanceReport() {
    if (this.attendanceData) { // Verifica que attendanceData no sea undefined y que tenga la propiedad 'data'
      const studentData = this.attendanceData.data.filter((attendance: any) => {
        return attendance.studentIds.some((student: any) => student.studentId === this.studentIdToReport);
      });

      if (studentData.length === 0) {
        // TODO ngIf no registros
        console.log('El estudiante no tiene registros de asistencia.');
        return;
      }

      const totalSessions = studentData.length;
      const presentSessions = studentData.filter((attendance: any) => {
        return attendance.studentIds.some((student: any) => student.studentId === this.studentIdToReport && student.attendanceStatus === 'Presente');
      }).length;

      const attendancePercentage = (presentSessions / totalSessions) * 100;

      // Generar el PDF usando el servicio
      this.pdfGeneratorService.generateAttendanceReportPDF('Nombre del Estudiante', studentData, this.studentIdToReport)
        .then((blob: any) => {
          this.blobPdf = URL.createObjectURL(blob);
          console.log('Informe de asistencia para el estudiante con ID', this.studentIdToReport);
          console.log('Total de sesiones: ', totalSessions);
          console.log('Asistencias: ', presentSessions);
          console.log('Porcentaje de asistencia: ', attendancePercentage.toFixed(2) + '%');
        })
        .catch((error: any) => {
          console.error('Error al generar el PDF:', error);
        });
    } else {
      console.log('Los datos de asistencia no están disponibles.');
    }
  }
}