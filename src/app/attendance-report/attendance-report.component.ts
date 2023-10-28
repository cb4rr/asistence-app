import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
  attendanceData: any;
  blobPdf: any;
  allUsers: any;
  singleUser: any;
  studentIdToReport = '';

  constructor(private attendance: AttendanceService, private pdfGeneratorService: PdfGeneratorService, private user: UserService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.attendance.getAllAttendances().subscribe({
      next: (response) => {
        this.attendanceData = response;
      }
    });
    this.user.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.data.filter((user: any) => user.userRole !== 'profesor');  
      }
    })
  }

  generateAttendanceReport() {
    if (this.attendanceData) { // Verifica que attendanceData no sea undefined y que tenga la propiedad 'data'
      const studentData = this.attendanceData.data.filter((attendance: any) => {
        return attendance.studentIds.some((student: any) => student.studentId === this.studentIdToReport);
      });

      if (studentData.length === 0) {
        // TODO ngIf no registros
        this.toastr.error('El estudiante no tiene registros de asistencia.');
        return;
      }

      const totalSessions = studentData.length;
      const presentSessions = studentData.filter((attendance: any) => {
        return attendance.studentIds.some((student: any) => student.studentId === this.studentIdToReport && student.attendanceStatus === 'Presente');
      }).length;

      const attendancePercentage = (presentSessions / totalSessions) * 100;

      // Generar el PDF usando el servicio
      this.pdfGeneratorService.generateAttendanceReportPDF(this.singleUser[0].userName + ' ' + this.singleUser[0].userLastName, studentData, this.studentIdToReport, totalSessions, presentSessions, attendancePercentage.toFixed(2) + '%')
        .then((blob: any) => {
          this.blobPdf = URL.createObjectURL(blob);
        })
        .catch((error: any) => {
          console.error('Error al generar el PDF:', error);
        });
    } else {
      console.log('Los datos de asistencia no están disponibles.');
    }
  }

  getSingleStudent(){
    this.singleUser = this.allUsers.filter((user: any) => user.userId === this.studentIdToReport);
  }
}