import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Course, DatumCourse, SingleCourse } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/api/v1/courses/`);
  }

  getOneCourse(courseId: string): Observable<SingleCourse> {
    return this.http.get<SingleCourse>(`${this.apiUrl}/api/v1/courses/${courseId}`);
  }

  createOneCourse(courseData: DatumCourse): Observable<SingleCourse> {
    return this.http.post<SingleCourse>(`${this.apiUrl}/api/v1/courses/`, courseData);
  }

  updateOneCourse(courseId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/courses/`, courseId, changes);
  }

  deleteOneCourse(courseId: string): Observable<SingleCourse> {
    return this.http.delete<SingleCourse>(`${this.apiUrl}/api/v1/courses/${courseId}`);
  }
}
