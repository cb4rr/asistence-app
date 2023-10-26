import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/users`);
  }

  getOneUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/users/${userId}`);
  }

  createOneUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/users/`, userData);
  }

  updateOneUser(userId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/users`, userId, changes);
  }

  deleteOneUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/users/${userId}`);
  }
}
