import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private baseUrl = 'http://localhost:3000/api/subcategories'; 

  constructor(private http: HttpClient) {} // Inyección del servicio HttpClient

  // Método para obtener todas las subcategorías
  getAllSubcategories(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Método para obtener una subcategoría por su ID
  getSubcategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Método para crear una nueva subcategoría
  createSubcategory(subcategory: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, subcategory);
  }

  // Método para actualizar una subcategoría existente
  updateSubcategory(id: number, subcategory: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, subcategory);
  }

  // Método para eliminar una subcategoría por su ID
  deleteSubcategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
