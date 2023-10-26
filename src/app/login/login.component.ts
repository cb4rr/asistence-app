import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  userPassword: string = '';

  constructor(private users: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

  LogIn() {
    const userData = {
      userId: this.userId,
      userPassword: this.userPassword
    };

    this.users.logInUser(userData).subscribe((response) => {
      if (!response.ok) {
        return this.router.navigate(['/login']);
      }
      console.log(response);
      this.toastr.success(`¡Bienvenido ${response.data.userName} ${response.data.userLastName}!`);
      return this.router.navigate(['/home']);
    });
  }
}
