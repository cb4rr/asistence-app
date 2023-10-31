import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../services/subject.service';
import { Attendance } from '../models/attendance';
import { DatumUser, SingleUser, User, UserRole } from '../models/user';
import { DatumSubject } from '../models/subject';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {
  attendanceData: Attendance = { ok: false, data: [] };
  blobPdf: any;
  allUsers: DatumUser[] = [];
  singleUser: SingleUser = { ok: false, data: { _id: '', __v: 0, userBornDate: new Date(), userEmail: '', userId: '', userLastName: '', userName: '', userPassword: '', userPhone: '', userRole: UserRole.Alumno } };
  studentIdToReport: string = '';
  todayDate: Date = new Date();
  selectedSubject: string = '';
  allSubjects: DatumSubject[] = [];

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
    const studentData = this.attendanceData.data.filter((attendance: any) => {
      return attendance.studentIds.some((student: any) => student.studentId === this.singleUser.data.userId && this.selectedSubject === attendance.codeSubject);
    });

    if (studentData.length === 0) {
      this.toastr.error('El estudiante no tiene registros de asistencia.');
      return;
    }

    const totalSessions = studentData.length;
    const presentSessions = studentData.filter((attendance: any) => {
      return attendance.studentIds.some((student: any) => student.studentId === this.singleUser.data.userId && student.attendanceStatus === 'Presente');
    }).length;

    const attendancePercentage = (presentSessions / totalSessions) * 100;

    this.pdfGeneratorService.generateAttendanceReportPDF(this.singleUser.data.userName + ' ' + this.singleUser.data.userLastName, studentData, this.singleUser.data.userId, totalSessions, presentSessions, attendancePercentage.toFixed(2) + '%')
      .then((blob: any) => {
        this.blobPdf = URL.createObjectURL(blob);
      })
      .catch((error: any) => {
        this.toastr.error('Error al generar el PDF');
      });
  }

  getSingleStudent() {
    this.user.getOneUser(this.studentIdToReport).subscribe({
      next: (response) => {
        this.singleUser = response;
      }
    });
  }
}