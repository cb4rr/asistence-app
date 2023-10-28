import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { ScheduleService } from '../services/schedule.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: any;
  subjectsTeacher: any;
  userInfo: any;
  todayDate: Date = new Date();
  daysOfWeek = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  today = new Date().getDay();
  todayName = this.daysOfWeek[this.today];
  subjectsForToday: any = [];
  schedulesTeacher: any;


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
      this.subject.getAllSubjects(), // Obtener todas las asignaturas
      this.schedule.getAllSchedules() // Obtener todos los horarios
    ]).subscribe({
      next: (data) => {
        const subjects = data[0].data; // Supongo que los datos relevantes están en data[0]
        const schedulesData = data[1].data; // Supongo que los datos relevantes están en data[1]
    
        // Filtrar los horarios según tu criterio (mismo profesor y día actual)
        this.schedulesTeacher = schedulesData[0].schedules.filter((schedule: any) =>
          schedule.teacherId === this.userInfo.data.userId && schedule.dayOfWeek.toLowerCase() === this.todayName.toLowerCase()
        );
    
        // Filtrar las asignaturas según tu criterio (mismo profesor)
        this.subjectsTeacher = subjects.filter((subject: any) =>
          subject.teacherId === this.userInfo.data.userId
        );
    
        // Ahora, combina las asignaturas con los horarios
        this.subjectsForToday = this.schedulesTeacher.map((schedule: any) => {
          const matchingSubject = this.subjectsTeacher.find((subject: any) =>
            subject.teacherId === schedule.teacherId
          );
    
          // Si se encuentra una asignatura que coincide con el horario, regresamos sus campos 'nameSubject' y 'codeSubject'
          if (matchingSubject) {
            return {
              nameSubject: matchingSubject.nameSubject,
              codeSubject: matchingSubject.codeSubject
            };
          }
          return null; // Puedes manejar esto según tus necesidades
        }).filter((subject: any) => subject !== null); // Filtra para eliminar valores nulos
      },
      error: (err) => {
        this.toastr.error('Ha ocurrido un error al buscar los datos.');
      }
    });
    
  }

  subjectInfo(subjectId: string) {
    console.log(subjectId);
    this.router.navigate(['/attendance', { teacher: this.userInfo.data._id, subject: subjectId }])
  }
}
