import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoryService {
  private baseUrl = 'http://localhost:3000/api/subcategories';
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  

  // Método para obtener todas las subcategorías
  getAllSubcategories(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(subcategories => subcategories.map(subcategory => ({
        ...subcategory,
        // Modificar las URLs de las imágenes para que apunten al backend
        ImagenURL: subcategory.ImagenURL ? `${this.apiUrl}${subcategory.ImagenURL}` : '',
        IconoURL: subcategory.IconoURL ? `${this.apiUrl}${subcategory.IconoURL}` : ''
      })))
    );
  }
  // Método para obtener una subcategoría por su ID
  getSubcategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Método para crear una nueva subcategoría con soporte para archivos
  createSubcategory(subcategory: any, imageFile?: File, iconFile?: File): Observable<any> {
    // No necesitamos FormData aquí porque ya tenemos las URLs de las imágenes
    const payload = {
      CategoriaID: subcategory.CategoriaID,
      Nombre: subcategory.Nombre,
      Descripcion: subcategory.Descripcion || '',
      Slug: subcategory.Slug,
      ImagenURL: subcategory.ImagenURL || '',
      IconoURL: subcategory.IconoURL || '',
      MetaTitle: subcategory.MetaTitle || '',
      MetaDescription: subcategory.MetaDescription || '',
      OrdenVisualizacion: subcategory.OrdenVisualizacion || '',
      Activo: subcategory.Activo,
      CreadoPor: 'system' // O el usuario actual
    };
  
    return this.http.post<any>(this.baseUrl, payload);
  }
  

  // Método para actualizar una subcategoría existente con soporte para archivos
  updateSubcategory(id: number, subcategory: any, imageFile?: File, iconFile?: File): Observable<any> {
    const formData = new FormData();
  
    // Añadir todos los campos al FormData
    formData.append('CategoriaID', subcategory.CategoriaID.toString());
    formData.append('Nombre', subcategory.Nombre);
    formData.append('Descripcion', subcategory.Descripcion || '');
    formData.append('Slug', subcategory.Slug);
    formData.append('MetaTitle', subcategory.MetaTitle || '');
    formData.append('MetaDescription', subcategory.MetaDescription || '');
    formData.append('OrdenVisualizacion', (subcategory.OrdenVisualizacion || '0').toString());
    formData.append('Activo', subcategory.Activo ? 'true' : 'false');
  
    // Añadir las URLs existentes si no hay nuevos archivos
    if (!imageFile && subcategory.ImagenURL) {
      formData.append('ImagenURL', subcategory.ImagenURL);
    }
    if (!iconFile && subcategory.IconoURL) {
      formData.append('IconoURL', subcategory.IconoURL);
    }
  
    // Añadir nuevos archivos si existen
    if (imageFile) {
      formData.append('ImagenURL', imageFile);
    }
    if (iconFile) {
      formData.append('IconoURL', iconFile);
    }
  
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData).pipe(
      catchError(error => {
        console.error('Error al actualizar:', error);
        throw new Error(error.error?.message || 'Error al actualizar la subcategoría');
      })
    );
  }
  

  // Método para eliminar una subcategoría por su ID
  deleteSubcategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar subcategoría:', error);
        throw error;
      })
    );
  }
}
