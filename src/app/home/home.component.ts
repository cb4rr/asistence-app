import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: any;
  subjectTeacher: any;
  userInfo: any;
  todayDate: Date = new Date();

  constructor(private route: ActivatedRoute, private subject: SubjectService, private toastr: ToastrService, private user: UserService, private router: Router) { }

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

    this.subject.getAllSubjects().subscribe({
      next: (response) => {
        this.subjectTeacher = response.data.filter((subject: any) => subject.teacherId === this.userInfo.data.userId);
      },
      error: () => {
        this.toastr.error('Ha ocurrido un error al buscar las asignaturas.')
      }
    });
  }

  subjectInfo(subjectId: string) {
    console.log(subjectId);
    this.router.navigate(['/attendance', { teacher: this.userInfo.data._id, subject: subjectId }])
  }
}
