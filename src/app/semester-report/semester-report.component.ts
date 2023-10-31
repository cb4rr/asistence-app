import { Component, OnInit } from '@angular/core';
import { PdfGeneratorService } from '../services/pdf-generator.service';
import { UserService } from '../services/user.service';
import { SubjectService } from '../services/subject.service';
import { DatumUser, SingleUser, UserRole } from '../models/user';
import { Subject } from '../models/subject';
import { ToastrService } from 'ngx-toastr';
import { CourseService } from '../services/course.service';
import { Course, DatumCourse } from '../models/course';
import { AttendanceService } from '../services/attendance.service';
import { Attendance } from '../models/attendance';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-semester-report',
  templateUrl: './semester-report.component.html',
  styleUrls: ['./semester-report.component.css']
})
export class SemesterReportComponent implements OnInit {
  allStudents: DatumUser[] = [];
  allSubjects: Subject = { ok: false, data: [] }
  blobPdfs: any[] = [];
  allCourses: Course = { ok: false, data: [] };
  selectedCourse: DatumCourse = { __v: 0, _id: '', courseName: '', modality: '', scheduleId: '', studentArray: [] };
  blobPdf: any;
  todayDate: Date = new Date();
  allAttendances: Attendance = { ok: false, data: [] };
  userId: string = '';
  userInfo: SingleUser = { ok: false, data: { _id: '', __v: 0, userBornDate: new Date(), userEmail: '', userId: '', userLastName: '', userName: '', userPassword: '', userPhone: '', userRole: UserRole.Profesor } }

  constructor(
    private pdfGeneratorService: PdfGeneratorService,
    private user: UserService,
    private subject: SubjectService,
    private toastr: ToastrService,
    private course: CourseService,
    private attendance: AttendanceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['teacher'];
    });

    this.user.getOneUser(this.userId).subscribe({
      next: (response) => {
        this.userInfo = response;
      }
    })

    this.user.getAllUsers().subscribe((response) => {
      this.allStudents = response.data.filter((user: any) => user.userRole !== 'profesor');
    });


    this.subject.getAllSubjects().subscribe((response) => {
      this.allSubjects = response;
    });

    this.course.getAllCourses().subscribe((response) => {
      this.allCourses = response;
    });

    this.attendance.getAllAttendances().subscribe((response) => {
      this.allAttendances = response;
    })
  }

  generateSemesterReports() {
    const studentAttendanceData: any = {};

    this.allAttendances.data.forEach((attendance) => {
      attendance.studentIds.forEach((student) => {
        const studentId = student.studentId;
        const courseCode = attendance.codeSubject;

        if (!studentAttendanceData[studentId]) {
          studentAttendanceData[studentId] = {};
        }

        if (!studentAttendanceData[studentId][courseCode]) {
          studentAttendanceData[studentId][courseCode] = [];
        }

        studentAttendanceData[studentId][courseCode].push({
          date: attendance.date,
          attendanceStatus: student.attendanceStatus,
        });
      });
    });

    this.pdfGeneratorService.generateSemesterReportPDF(
      studentAttendanceData,
      this.allStudents
    ).then((pdfBlob) => {
      // Aquí puedes hacer algo con el PDF, como descargarlo o mostrarlo en el navegador
      this.blobPdf = window.URL.createObjectURL(pdfBlob);
      this.toastr.success('¡Informe generado exitosamente!');
    }).catch((error) => {
      this.toastr.error('Error al generar el informe', error);
    });

  }
}