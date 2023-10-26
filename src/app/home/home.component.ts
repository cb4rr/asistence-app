import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userId: any;
  subjectTeacher: any;

  constructor(private route: ActivatedRoute, private subject: SubjectService, private toastr: ToastrService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = params['teacher'];
    });

    this.subject.getAllSubjects().subscribe({
      next: (response) => {
        this.subjectTeacher = response.data.filter((subject: any) => subject.teacherId === this.userId);
      },
      error: () => {
        this.toastr.error('Ha ocurrido un error al buscar las asignaturas.')
      }
    })
  }

}
