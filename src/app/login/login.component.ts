import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  userPassword: string = '';

  constructor(private users: UserService, private router: Router) { }

  ngOnInit() {
  }

  LogIn() {
    const userData = {
      userId: this.userId,
      userPassword: this.userPassword
    };

    this.users.logInUser(userData).subscribe((response) => {
      sessionStorage.setItem("token", response.token);
    });
    this.router.navigate(['/home']);
  }
}
