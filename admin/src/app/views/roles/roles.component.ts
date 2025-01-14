import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RolesService } from '../../services/roles.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = []; // Lista de roles
  roleForm: FormGroup; // Formulario reactivo para agregar/editar roles
  isEditing = false; // Flag para indicar si se está editando
  editingRoleId: number | null = null; // ID del rol que se está editando


  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder
  ) {
    // Crear el formulario reactivo
    this.roleForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  // Cargar todos los roles desde el backend
  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data; // Verifica que `data` contiene los roles correctos
        console.log('Roles cargados:', this.roles); // Depuración para verificar
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      },
    });
  }
  

  // Manejar el envío del formulario
  onSubmit(): void {
    if (this.roleForm.invalid) {
      // Marcar todos los controles como tocados para mostrar errores
      this.roleForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor completa los campos requeridos.', 'error');
      return;
    }
  
    const roleData = this.roleForm.value;
  
    // Mostrar indicador de carga
    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor espera mientras se procesa la solicitud.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    if (this.isEditing && this.editingRoleId !== null) {
      // Editar rol existente
      this.rolesService.updateRole(this.editingRoleId, roleData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Rol actualizado correctamente.', 'success');
          this.resetForm();
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al actualizar rol:', error);
          Swal.fire('Error', error?.message || 'No se pudo actualizar el rol.', 'error');
        }
      });
    } else {
      // Crear un nuevo rol
      this.rolesService.createRole(roleData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Rol creado correctamente.', 'success');
          this.resetForm();
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          Swal.fire('Error', error?.message || 'No se pudo crear el rol.', 'error');
        }
      });
    }
  
  
  }

  // Editar un rol existente
  onEdit(role: any): void {
    this.isEditing = true;
    this.editingRoleId = role.RolID; 
    this.roleForm.patchValue(role);
  }
  

  // Cancelar acción de edición o creación
  onCancel(): void {
    this.resetForm();
  }

  // Eliminar un rol
  onDelete(roleId: number): void {
    console.log('Intentando eliminar el rol con ID:', roleId); // Agrega este log para depuración
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolesService.deleteRole(roleId).subscribe({
          next: () => {
            Swal.fire('Éxito', 'Rol eliminado correctamente.', 'success');
            this.loadRoles();
          },
          error: (error) => {
            console.error('Error al eliminar rol:', error);
            Swal.fire('Error', 'No se pudo eliminar el rol.', 'error');
          }
        });
      }
    });
  }
  

  // Resetear el formulario
  resetForm(): void {
    this.roleForm.reset();
    this.isEditing = false;
    this.editingRoleId = null;
  }
}
