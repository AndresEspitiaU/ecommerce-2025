import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;
  isEditing = false;
  editingCategoryId: number | null = null;

  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]],
      slug: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías.', 'error');
      },
    });
  }

  isSlugUnique(slug: string): boolean {
    return !this.categories.some(
      (category) => category.Slug === slug && category.CategoriaID !== this.editingCategoryId
    );
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    const categoryData = this.categoryForm.value;

    if (this.isEditing && this.editingCategoryId !== null) {
      this.updateCategory(categoryData);
    } else {
      this.createCategory(categoryData);
    }
  }

  createCategory(categoryData: any): void {
    if (!this.isSlugUnique(categoryData.slug)) {
      Swal.fire('Error', 'El Slug ya está en uso. Elige uno diferente.', 'error');
      return;
    }

    this.categoryService.createCategory(categoryData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Categoría creada correctamente.', 'success');
        this.resetForm();
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        Swal.fire('Error', 'No se pudo crear la categoría.', 'error');
      },
    });
  }

  updateCategory(categoryData: any): void {
    if (!this.isSlugUnique(categoryData.slug)) {
      Swal.fire('Error', 'El Slug ya está en uso. Elige uno diferente.', 'error');
      return;
    }
  
    this.categoryService.updateCategory(this.editingCategoryId!, categoryData).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Categoría actualizada correctamente.', 'success');
        this.resetForm();
        this.loadCategories();
      },
      error: (error: any) => {
        console.error('Error al actualizar categoría:', error);
        const errorMessage = error?.error?.error || 'Ocurrió un error interno al actualizar la categoría.';
        Swal.fire('Error', errorMessage, 'error');
      },
    });
  }
  

  onEdit(category: any): void {
    this.isEditing = true;
    this.editingCategoryId = category.CategoriaID;
    this.categoryForm.patchValue({
      name: category.Nombre,
      description: category.Descripcion,
      slug: category.Slug,
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Categoría eliminada correctamente.', 'success');
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error al eliminar categoría:', error);
            Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
          },
        });
      }
    });
  }

  resetForm(): void {
    this.categoryForm.reset();
    this.isEditing = false;
    this.editingCategoryId = null;
  }
}
