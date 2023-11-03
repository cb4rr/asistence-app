import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ScheduleService } from '../services/schedule.service';
import { forkJoin } from 'rxjs';
import { DatumSubject } from '../models/subject';
import { SingleUser, UserRole } from '../models/user';
import { Schedules } from '../models/schedule';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: string = '';
  userInfo: SingleUser = { ok: false, data: { _id: '', __v: 0, userId: '', userEmail: '', userBornDate: new Date(), userLastName: '', userName: '', userPassword: '', userPhone: '', userRole: UserRole.Profesor } };
  todayDate: Date = new Date();
  daysOfWeek: string[] = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  today = new Date().getDay();
  todayName: string = this.daysOfWeek[this.today];
  subjectsForToday: DatumSubject[] = [];
  schedulesTeacher: Schedules[] = [];
  teacherData: SingleUser = { ok: false, data: { _id: '', __v: 0, userBornDate: new Date(), userEmail: '', userId: '', userLastName: '', userName: '', userPassword: '', userPhone: '', userRole: UserRole.Profesor } }


  constructor(private route: ActivatedRoute, private subject: SubjectService, private toastr: ToastrService, private user: UserService, private router: Router, private schedule: ScheduleService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['teacher'];
    });

    this.user.getOneUser(this.userId).subscribe({
      next: (response) => {
        this.userInfo = response;
      },
      error: () => {
        this.toastr.error('Ha ocurrido un error al buscar al profesor.')
      }
    });


    forkJoin([
      this.subject.getAllSubjects(),
      this.schedule.getAllSchedules()
    ]).subscribe({
      next: (data) => {
        const subjects = data[0].data;
        const schedulesData = data[1].data;

        this.schedulesTeacher = schedulesData[0].schedules.filter((schedule) => schedule.dayOfWeek === this.todayName && schedule.teacherId === this.userInfo.data.userId);

        this.subjectsForToday = subjects.filter((subject) => {
          return this.schedulesTeacher.some((schedule) => subject.teacherId === this.userInfo.data.userId && schedule.nameSubject === subject.nameSubject)
        });
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error al buscar los datos.');
      }
    });
  }

  subjectInfo(subject: any) {
    this.router.navigate(['/attendance', { teacher: this.userInfo.data._id, subject: subject._id }]);
  }

  getReport() {
    this.router.navigate(['/report', { teacher: this.userId }]);
  }

  getSemesterReport() {
    this.router.navigate(['/report-semester', { teacher: this.userId }]);
  }
}
