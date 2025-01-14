import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PermissionsService } from '../../services/permissions.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  permissions: any[] = []; // Lista de permisos
  permissionForm: FormGroup; // Formulario reactivo para agregar/editar permisos
  isEditing = false; // Flag para indicar si se está editando
  editingPermissionId: number | null = null; // ID del permiso que se está editando

  constructor(
    private permissionsService: PermissionsService,
    private fb: FormBuilder
  ) {
    // Crear el formulario reactivo
    this.permissionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(255)]],
      modulo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  // Cargar todos los permisos desde el backend
  loadPermissions(): void {
    this.permissionsService.getPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
        Swal.fire('Error', 'No se pudieron cargar los permisos.', 'error');
      }
    });
  }

  // Manejar el envío del formulario
  onSubmit(): void {
    if (this.permissionForm.invalid) {
      Swal.fire('Error', 'Por favor completa los campos requeridos.', 'error');
      return;
    }

    const permissionData = this.permissionForm.value;

    if (this.isEditing && this.editingPermissionId !== null) {
      // Editar permiso existente
      this.permissionsService.updatePermission(this.editingPermissionId, permissionData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Permiso actualizado correctamente.', 'success');
          this.resetForm();
          this.loadPermissions();
        },
        error: (error) => {
          console.error('Error al actualizar permiso:', error);
          Swal.fire('Error', 'No se pudo actualizar el permiso.', 'error');
        }
      });
    } else {
      // Crear un nuevo permiso
      this.permissionsService.createPermission(permissionData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Permiso creado correctamente.', 'success');
          this.resetForm();
          this.loadPermissions();
        },
        error: (error) => {
          console.error('Error al crear permiso:', error);
          Swal.fire('Error', 'No se pudo crear el permiso.', 'error');
        }
      });
    }
  }

  // Editar un permiso existente
  onEdit(permission: any): void {
    this.isEditing = true;
    this.editingPermissionId = permission.PermisoID;
    this.permissionForm.patchValue(permission);
  }

  // Eliminar un permiso
  onDelete(permissionId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.permissionsService.deletePermission(permissionId).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Permiso eliminado correctamente.', 'success');
            this.loadPermissions();
          },
          error: (error) => {
            console.error('Error al eliminar permiso:', error);
            Swal.fire('Error', 'No se pudo eliminar el permiso.', 'error');
          }
        });
      }
    });
  }

  // Resetear el formulario
  resetForm(): void {
    this.permissionForm.reset();
    this.isEditing = false;
    this.editingPermissionId = null;
  }
}
