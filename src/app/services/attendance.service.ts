import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Attendance, DatumAttendance, SingleAttendance } from '../models/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllAttendances(): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.apiUrl}/api/v1/attendances/`);
  }

  getOneAttendance(attendanceId: string): Observable<SingleAttendance> {
    return this.http.get<SingleAttendance>(`${this.apiUrl}/api/v1/attendances/${attendanceId}`);
  }

  createOneAttendance(attendanceData: DatumAttendance): Observable<SingleAttendance> {
    return this.http.post<SingleAttendance>(`${this.apiUrl}/api/v1/attendances/`, attendanceData);
  }

  updateOneAttendance(attendanceId: string, changes: any): Observable<any> {
    return this.http.patch<SingleAttendance>(`${this.apiUrl}/api/v1/attendances/`, attendanceId, changes);
  }

  deleteOneAttendance(attendanceId: string): Observable<SingleAttendance> {
    return this.http.delete<SingleAttendance>(`${this.apiUrl}/api/v1/attendances/${attendanceId}`);
  }
}
