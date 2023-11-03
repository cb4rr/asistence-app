import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatumSchedule, Schedule, SingleSchedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllSchedules(): Observable<Schedule> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/schedules/`);
  }

  getOneSchedule(scheduleId: string): Observable<SingleSchedule> {
    return this.http.get<SingleSchedule>(`${this.apiUrl}/api/v1/schedules/${scheduleId}`);
  }

  createOneSchedule(scheduleData: DatumSchedule): Observable<SingleSchedule> {
    return this.http.post<SingleSchedule>(`${this.apiUrl}/api/v1/schedules/`, scheduleData);
  }

  updateOneSchedule(scheduleId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/schedules/`, scheduleId, changes);
  }

  deleteOneSchedule(scheduleId: string): Observable<SingleSchedule> {
    return this.http.delete<SingleSchedule>(`${this.apiUrl}/api/v1/schedules/${scheduleId}`);
  }
}
