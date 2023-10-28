import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../services/subject.service';

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
  todayDate: Date = new Date();
  selectedSubject: string = '';
  allSubjects: any;

  constructor(private attendance: AttendanceService, private pdfGeneratorService: PdfGeneratorService, private user: UserService, private toastr: ToastrService, private subject: SubjectService) {
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
    });

    this.subject.getAllSubjects().subscribe({
      next: (response) => {
        this.allSubjects = response.data;
      }
    })
  }

  generateAttendanceReport() {
    if (this.attendanceData) {
      const studentData = this.attendanceData.data.filter((attendance: any) => {
        return attendance.studentIds.some((student: any) => student.studentId === this.studentIdToReport && this.selectedSubject === attendance.codeSubject);
      });

      if (studentData.length === 0) {
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
          this.toastr.error('Error al generar el PDF');
        });
    } else {
      this.toastr.error('Los datos de asistencia no están disponibles.');
    }
  }

  getSingleStudent() {
    this.singleUser = this.allUsers.filter((user: any) => user.userId === this.studentIdToReport);
  }
}