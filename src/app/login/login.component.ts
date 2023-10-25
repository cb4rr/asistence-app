import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  userPassword: string = '';

  constructor(private users: UserService) { }

  ngOnInit() {
  }

  LogIn() {
    const userData = {
      userId: this.userId,
      userPassword: this.userPassword
    };

    this.users.logInUser(userData).subscribe((response) => {
      console.log(response);
    })
  }
}
