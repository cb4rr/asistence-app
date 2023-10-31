import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() userName: string = '';
  @Input() teacherId: string = '';
  todayDate: Date = new Date();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  redirectHome(){
    this.router.navigate(['/home', { teacher: this.teacherId }])
  }
}
