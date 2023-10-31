import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatumSubject, SingleSubject, Subject } from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllSubjects(): Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/api/v1/subjects/`);
  }

  getOneSubject(subjectId: string): Observable<SingleSubject> {
    return this.http.get<SingleSubject>(`${this.apiUrl}/api/v1/subjects/${subjectId}`);
  }

  createOneSubject(subjectData: DatumSubject): Observable<SingleSubject> {
    return this.http.post<SingleSubject>(`${this.apiUrl}/api/v1/subjects/`, subjectData);
  }

  updateOneSubject(subjectId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/subjects/`, subjectId, changes);
  }

  deleteOneSubject(subjectId: string): Observable<SingleSubject> {
    return this.http.delete<SingleSubject>(`${this.apiUrl}/api/v1/subjects/${subjectId}`);
  }
}
