import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Importación corregida


interface CustomJwtPayload extends JwtPayload {
  roles?: string[];
  permissions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth'; // Cambiar según configuración
  private readonly TOKEN_KEY = 'authToken'; // Clave para almacenar el token

  constructor(private http: HttpClient) {}

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post(`${this.baseUrl}/login`, body, { headers });
  }

  // Método para guardar el token en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Método para obtener el token desde el almacenamiento local
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    
    const decodedToken: any = this.decodeToken(token);
    console.log('Roles desde el token:', decodedToken.roles);
    return decodedToken.roles || [];
  }
  
  getUserPermissions(): string[] {
    const token = this.getToken(); 
    if (!token) return [];
  
    try {
      const decodedToken: any = this.decodeToken(token); // Decodificar token
      return decodedToken.permissions || []; // Retornar permisos
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return [];
    }
  }
  
  
  private decodeToken(token: string): any {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      console.log('Token decodificado:', decoded); // Verifica aquí los datos
      return decoded;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }
  
  
  // Verificar si el usuario tiene permisos específicos
  hasPermissions(requiredPermissions: string[]): boolean {
    const userPermissions = this.getUserPermissions();
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  }
}
