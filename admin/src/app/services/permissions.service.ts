import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private baseUrl = 'http://localhost:3000/api/permissions'; // Cambiar la URL según tu configuración

  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createPermission(permission: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, permission);
  }

  updatePermission(permissionId: number, permission: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${permissionId}`, permission);
  }

  deletePermission(permissionId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${permissionId}`);
  }
}
