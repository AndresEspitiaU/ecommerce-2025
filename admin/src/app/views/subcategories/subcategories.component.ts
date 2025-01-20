import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubcategoryService } from '../../services/subcategory.service';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.scss'],
})
export class SubcategoriesComponent implements OnInit {
  categories: any[] = [];
  subcategories: any[] = [];
  subcategoryForm: FormGroup;
  isEditing = false;
  editingSubcategoryId: number | null = null;
  selectedImageFile: File | null = null;
  selectedIconFile: File | null = null;

  constructor(
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.subcategoryForm = this.fb.group({
      CategoriaID: [null, [Validators.required]],
      Nombre: ['', [Validators.required, Validators.maxLength(50)]],
      Descripcion: ['', [Validators.maxLength(255)]],
      Slug: ['', [Validators.required, Validators.maxLength(50)]],
      ImagenURL: ['', [Validators.maxLength(255)]],
      IconoURL: ['', [Validators.maxLength(255)]],
      MetaTitle: ['', [Validators.maxLength(60)]],
      MetaDescription: ['', [Validators.maxLength(160)]],
      OrdenVisualizacion: [null, [Validators.pattern('^[0-9]+$')]],
      Activo: [true],
    });
  }

  // Carga las categorías y subcategorías al iniciar el componente
  ngOnInit(): void {
    this.loadSubcategories();
    this.loadCategories();
  }

  // Carga las categorías y subcategorías
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error');
      },
    });
  }

  // Carga las subcategorías
  loadSubcategories(): void {
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (data) => (this.subcategories = data),
      error: (error) => {
        console.error('Error al cargar subcategorías:', error);
        Swal.fire('Error', 'No se pudieron cargar las subcategorías.', 'error');
      },
    });
  }

  // Actualiza el archivo seleccionado
  onImageChange(event: Event, type: 'image' | 'icon'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (type === 'image') {
        this.selectedImageFile = file;
      } else {
        this.selectedIconFile = file;
      }
    }
  }

  // Sube un archivo al servidor
  uploadFile(file: File, type: 'image' | 'icon'): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
  
      const uploadUrl = `http://localhost:3000/api/upload`;
  
      this.http.post<{ filePath: string }>(uploadUrl, formData).subscribe({
        next: (response) => {
          if (response.filePath) {
            console.log(`${type} subido correctamente:`, response.filePath);
            resolve(response.filePath);
          } else {
            Swal.fire('Error', `No se recibió una ruta válida para el ${type}.`, 'error');
            reject(new Error(`No se recibió una ruta válida para el ${type}.`));
          }
        },
        error: (error) => {
          console.error(`Error al subir el ${type}:`, error);
          Swal.fire('Error', `No se pudo subir el ${type}.`, 'error');
          reject(error);
        },
      });
    });
  }
  
  
  // Envía el formulario de subcategoría al backend
  async onSubmit(): Promise<void> {
    if (this.subcategoryForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    if (!this.subcategoryForm.value.CategoriaID) {
      Swal.fire('Error', 'Debe seleccionar una categoría', 'error');
      return;
    }
  
    try {
      // Crear una copia de los datos del formulario
      const subcategoryData = { ...this.subcategoryForm.value };
      
      // Asegurarnos de que CategoriaID sea un número
      subcategoryData.CategoriaID = Number(subcategoryData.CategoriaID);

      // Manejar la carga de imágenes
      if (this.selectedImageFile) {
        try {
          const imageResponse = await this.uploadFile(this.selectedImageFile, 'image');
          subcategoryData.ImagenURL = imageResponse;
        } catch (error) {
          console.error('Error al subir imagen:', error);
          throw new Error('Error al subir la imagen');
        }
      }

      if (this.selectedIconFile) {
        try {
          const iconResponse = await this.uploadFile(this.selectedIconFile, 'icon');
          subcategoryData.IconoURL = iconResponse;
        } catch (error) {
          console.error('Error al subir icono:', error);
          throw new Error('Error al subir el icono');
        }
      }

      // Preparar el payload final
      const payload = {
        CategoriaID: subcategoryData.CategoriaID,
        Nombre: subcategoryData.Nombre?.trim(),
        Descripcion: subcategoryData.Descripcion?.trim() || '',
        Slug: subcategoryData.Slug?.trim(),
        ImagenURL: subcategoryData.ImagenURL || '',
        IconoURL: subcategoryData.IconoURL || '',
        MetaTitle: subcategoryData.MetaTitle?.trim() || '',
        MetaDescription: subcategoryData.MetaDescription?.trim() || '',
        OrdenVisualizacion: subcategoryData.OrdenVisualizacion || 0,
        Activo: subcategoryData.Activo === true
      };

      if (this.isEditing && this.editingSubcategoryId !== null) {
        // Si estamos editando, mantener las URLs existentes si no hay nuevos archivos
        if (!this.selectedImageFile) {
          payload.ImagenURL = this.subcategoryForm.get('ImagenURL')?.value || '';
        }
        if (!this.selectedIconFile) {
          payload.IconoURL = this.subcategoryForm.get('IconoURL')?.value || '';
        }

        this.subcategoryService.updateSubcategory(this.editingSubcategoryId, payload)
          .subscribe({
            next: () => {
              Swal.fire('Éxito', 'Subcategoría actualizada correctamente.', 'success');
              this.resetForm();
              this.loadSubcategories();
            },
            error: (error) => {
              console.error('Error al actualizar subcategoría:', error);
              let errorMessage = 'No se pudo actualizar la subcategoría.';
              
              if (error.error?.field === 'Slug') {
                errorMessage = 'El slug ya está en uso por otra subcategoría. Por favor, use un slug diferente.';
              }
              
              Swal.fire('Error', errorMessage, 'error');
            },
          });
      } else {
        // Crear nueva subcategoría
        this.subcategoryService.createSubcategory(payload)
          .subscribe({
            next: () => {
              Swal.fire('Éxito', 'Subcategoría creada correctamente.', 'success');
              this.resetForm();
              this.loadSubcategories();
            },
            error: (error) => {
              console.error('Error al crear subcategoría:', error);
              Swal.fire('Error', 'No se pudo crear la subcategoría: ' + 
                (error.error?.message || 'Error desconocido'), 'error');
            }
          });
      }
    } catch (error) {
      console.error('Error en el proceso:', error);
      Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
    }
}

  // Carga los datos de la subcategoría seleccionada en el formulario para editar
  onEdit(subcategory: any): void {
    this.isEditing = true;
    this.editingSubcategoryId = subcategory.SubcategoriaID;
    
    // Resetear los archivos seleccionados
    this.selectedImageFile = null;
    this.selectedIconFile = null;
    
    // Actualizar el formulario con los valores existentes
    this.subcategoryForm.patchValue({
      CategoriaID: subcategory.CategoriaID,
      Nombre: subcategory.Nombre,
      Descripcion: subcategory.Descripcion || '',
      Slug: subcategory.Slug,
      ImagenURL: subcategory.ImagenURL || '',
      IconoURL: subcategory.IconoURL || '',
      MetaTitle: subcategory.MetaTitle || '',
      MetaDescription: subcategory.MetaDescription || '',
      OrdenVisualizacion: subcategory.OrdenVisualizacion || 0,
      Activo: subcategory.Activo === true
    });
  }

  // Elimina una subcategoría
onDelete(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará permanentemente la subcategoría.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
  }).then((result) => {
    if (result.isConfirmed) {
      this.subcategoryService.deleteSubcategory(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Eliminado',
            text: 'Subcategoría eliminada correctamente.',
            icon: 'success',
            timer: 1500
          });
          this.loadSubcategories();
        },
        error: (error) => {
          console.error('Error al eliminar subcategoría:', error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar la subcategoría. ' + 
                  (error.error?.message || 'Error del servidor'),
            icon: 'error'
          });
        },
      });
    }
  });
}

  // Resetea el formulario y los valores de edición
  resetForm(): void {
    this.subcategoryForm.reset({ Activo: true });
    this.isEditing = false;
    this.editingSubcategoryId = null;
    this.selectedImageFile = null;
    this.selectedIconFile = null;
  }

  // Obtiene el nombre de la categoría a partir de su ID
  getCategoryName(categoriaId: number): string {
    const category = this.categories.find((cat) => cat.CategoriaID === categoriaId);
    return category ? category.Nombre : 'Sin categoría';
  }
}
