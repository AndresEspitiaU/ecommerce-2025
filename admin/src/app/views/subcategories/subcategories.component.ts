import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubcategoryService } from '../../services/subcategory.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

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

  constructor(
    private subcategoryService: SubcategoryService, 
    private categoryService: SubcategoryService,
    private fb: FormBuilder) {
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
    });
  }

  ngOnInit(): void {
    this.loadSubcategories();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllSubcategories().subscribe({
      next: (data) => (this.categories = data),
      error: (error) => console.error('Error al cargar categorías:', error),
    });
  }

  loadSubcategories(): void {
    this.subcategoryService.getAllSubcategories().subscribe({
      next: (data) => (this.subcategories = data),
      error: (error) => console.error('Error al cargar subcategorías:', error),
    });
  }

  onSubmit(): void {
    if (this.subcategoryForm.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos requeridos.', 'error');
      return;
    }

    const subcategoryData = this.subcategoryForm.value;

    if (this.isEditing && this.editingSubcategoryId !== null) {
      this.subcategoryService.updateSubcategory(this.editingSubcategoryId, subcategoryData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Subcategoría actualizada correctamente.', 'success');
          this.resetForm();
          this.loadSubcategories();
        },
        error: (error) => {
          console.error('Error al actualizar subcategoría:', error);
          Swal.fire('Error', 'No se pudo actualizar la subcategoría.', 'error');
        },
      });
    } else {
      this.subcategoryService.createSubcategory(subcategoryData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Subcategoría creada correctamente.', 'success');
          this.resetForm();
          this.loadSubcategories();
        },
        error: (error) => {
          console.error('Error al crear subcategoría:', error);
          Swal.fire('Error', 'No se pudo crear la subcategoría.', 'error');
        },
      });
    }
  }

  onEdit(subcategory: any): void {
    this.isEditing = true;
    this.editingSubcategoryId = subcategory.SubcategoriaID;
    this.subcategoryForm.patchValue(subcategory);
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
        this.subcategoryService.deleteSubcategory(id).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Subcategoría eliminada correctamente.', 'success');
            this.loadSubcategories();
          },
          error: (error) => {
            console.error('Error al eliminar subcategoría:', error);
            Swal.fire('Error', 'No se pudo eliminar la subcategoría.', 'error');
          },
        });
      }
    });
  }

  resetForm(): void {
    this.subcategoryForm.reset();
    this.isEditing = false;
    this.editingSubcategoryId = null;
  }

  getCategoryName(categoriaId: number): string {
    const category = this.categories.find((cat) => cat.CategoriaID === categoriaId);
    return category ? category.Nombre : 'Sin categoría';
  }
}
