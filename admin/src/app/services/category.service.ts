import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/categories'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createCategory(category: { name: string; description: string; slug: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, category);
  }

  updateCategory(id: number, category: { name: string; description: string; slug: string }): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, category);
  }  
  

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
