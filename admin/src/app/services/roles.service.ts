import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private baseUrl = 'http://localhost:3000/api/roles'; // Cambiar la URL según tu configuración

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createRole(role: { nombre: string; descripcion: string }): Observable<any> {
    return this.http.post<any>(this.baseUrl, role);
  }
  

  updateRole(roleId: number, role: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${roleId}`, role);
  }

  deleteRole(roleId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roleId}`);
  }
  
}
