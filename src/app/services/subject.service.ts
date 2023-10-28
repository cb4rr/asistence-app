import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  apiUrl: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllSubjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/subjects/`);
  }

  getOneSubject(subjectId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/v1/subjects/${subjectId}`);
  }

  createOneSubject(subjectData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/v1/subjects/`, subjectData);
  }

  updateOneSubject(subjectId: string, changes: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/v1/subjects/`, subjectId, changes);
  }

  deleteOneSubject(subjectId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/v1/subjects/${subjectId}`);
  }
}
