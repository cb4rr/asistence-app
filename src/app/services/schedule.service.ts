import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllSchedules(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/schedules/`);
  }

  getOneSchedule(scheduleId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/schedules/${scheduleId}`);
  }

  createOneSchedule(scheduleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/schedules/`, scheduleData);
  }

  updateOneSchedule(scheduleId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/schedules/`, scheduleId, changes);
  }

  deleteOneSchedule(scheduleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/schedules/${scheduleId}`);
  }
}
