import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/courses`);
  }

  getOneCourse(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/courses/${courseId}`);
  }

  createOneCourse(courseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/courses/`, courseData);
  }

  updateOneCourse(courseId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/courses`, courseId, changes);
  }

  deleteOneCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/courses/${courseId}`);
  }
}
