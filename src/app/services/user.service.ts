import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatumUser, SingleUser, User } from '../models/user';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  logInUser(userData: any): Observable<Login> {
    return this.http.post<Login>(`${this.apiUrl}/api/v1/users/login/`, userData);
  }

  getAllUsers(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/v1/users/`);
  }

  getOneUser(userId: string): Observable<SingleUser> {
    return this.http.get<SingleUser>(`${this.apiUrl}/api/v1/users/${userId}`);
  }

  createOneUser(userData: DatumUser): Observable<SingleUser> {
    return this.http.post<SingleUser>(`${this.apiUrl}/api/v1/users/`, userData);
  }

  updateOneUser(userId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/users/`, userId, changes);
  }

  deleteOneUser(userId: string): Observable<SingleUser> {
    return this.http.delete<SingleUser>(`${this.apiUrl}/api/v1/users/${userId}`);
  }
}
