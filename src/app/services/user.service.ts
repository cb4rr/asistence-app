import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/users`);
  }

  logInUser(userData: any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/v1/users/login`, userData);
  }
}
