import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllAttendances(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/attendances`);
  }

  getOneAttendance(attendanceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/attendances/${attendanceId}`);
  }

  createOneAttendance(attendanceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/attendances/`, attendanceData);
  }

  updateOneAttendance(attendanceId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/attendances`, attendanceId, changes);
  }

  deleteOneAttendance(attendanceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/attendances/${attendanceId}`);
  }
}
