import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttendanceService } from 'src/app/services/attendance.service';
import { CourseService } from 'src/app/services/course.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UserService } from 'src/app/services/user.service';
import { Course } from '../models/course';
import { DatumUser, SingleUser, User, UserRole } from '../models/user';
import { Schedule, Schedules } from '../models/schedule';
import { SingleSubject } from '../models/subject';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  teacherId: string = '';
  subjectId: string = '';
  todayDate: Date = new Date();
  allCourses: Course = { ok: false, data: [] };
  allStudents: DatumUser[] = [];
  workdaySelected: string = '';
  courseSelected: string = '';
  filteredCourse: any;
  informationCourse: SingleSubject = { ok: false, data: { _id: '', __v: 0, nameSubject: '', teacherId: '', codeSubject: '' } };
  attendanceDetails: { [studentId: string]: string } = {};
  scheduleCourse: Schedules[] = [];
  allSchedules: Schedule = { ok: false, data: [] };
  teacherData: SingleUser = { ok: false, data: { _id: '', userId: '', userName: '', userLastName: '', userRole: UserRole.Profesor, userEmail: '', __v: 0, userBornDate: new Date(), userPassword: '', userPhone: '' } };


  constructor(private route: ActivatedRoute, private user: UserService, private subject: SubjectService, private course: CourseService, private attendance: AttendanceService, private schedule: ScheduleService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.teacherId = params['teacher'];
      this.subjectId = params['subject'];
    });

    this.course.getAllCourses().subscribe({
      next: (response) => {
        this.allCourses = response;
      }
    });
    this.user.getAllUsers().subscribe({
      next: (response) => {
        this.allStudents = response.data?.filter((student: any) => student.userRole === 'alumno');
      }
    });
    this.subject.getOneSubject(this.subjectId).subscribe({
      next: (response) => {
        this.informationCourse = response;
      },
      error: () => {

      }
    });
    this.schedule.getAllSchedules().subscribe({
      next: (response) => {
        this.allSchedules = response;
      },
      error: () => {

      }
    });

    this.user.getOneUser(this.teacherId).subscribe({
      next: (response) => {
        this.teacherData = response;
      }
    })
  }

  getCourses() {
    this.filteredCourse = this.allCourses.data.filter((course: any) => course.modality === this.workdaySelected);
    this.courseSelected = '';
  }

  getSchedule() {
    if (this.allSchedules && this.allSchedules.data && this.allSchedules.data.length > 0) {
      const matchingSchedules = this.allSchedules.data[0].schedules.filter((schedule: any) => schedule.courseId === this.courseSelected && this.teacherData.data.userId === schedule.teacherId);

      console.log(matchingSchedules);

      if (matchingSchedules.length > 0) {
        this.scheduleCourse = matchingSchedules;
      } else {
        this.workdaySelected = '';
        this.scheduleCourse = [];
        this.filteredCourse = [];
      }
    }
  }

  getStudentName(studentId: string) {
    const student = this.allStudents.find((student: any) => student.userId === studentId);
    return student?.userName + ' ' + student?.userLastName;
  }

  updateStudentAttendance(studentId: string, status: string) {
    this.attendanceDetails[studentId] = status;
  }

  confirmAttendance() {
    const attendanceDetails: any = [];

    this.filteredCourse.forEach((course: any) => {
      course.studentArray.forEach((student: any) => {
        const studentId = student;
        const attendanceStatus = this.attendanceDetails[studentId];
        attendanceDetails.push({
          studentId: studentId,
          attendanceStatus: attendanceStatus ? attendanceStatus : 'Ausente',
        });
      });
    });

    const attendanceToInsert = {
      "date": this.todayDate.toISOString().split('T')[0],
      "courseId": this.courseSelected,
      "codeSubject": this.informationCourse.data.codeSubject,
      "subjectTeacherId": this.teacherData.data.userId,
      "studentIds": attendanceDetails
    };

    this.attendance.createOneAttendance(attendanceToInsert).subscribe({
      next: (response) => {
        this.toastr.success('¡Asistencia añadida!');
        this.router.navigate(['/home', { teacher: this.teacherId }]);
      },
      error: (error) => {
        this.toastr.error('Error al añadir asistencia...');
      }
    })
  };
}
