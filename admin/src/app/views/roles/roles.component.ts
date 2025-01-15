import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RolesService } from '../../services/roles.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FilterPipe } from './filter.pipe';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, NgIf, FilterPipe, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  roleForm: FormGroup;
  isEditing = false;
  editingRoleId: number | null = null;
  permissions: any[] = [];
  rolePermissions: any[] = [];
  selectedRoleId: number | null = null;
  allPermissions: any[] = [];
  searchTerm: string = '';
  assignedSearchTerm: string = '';
  availableSearchTerm: string = '';


  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder
  ) {
    this.roleForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  // Ver permisos de un rol y abrir el modal
  viewPermissions(roleId: number): void {
    this.selectedRoleId = roleId;
    this.loadRolePermissions();
    this.filterAvailablePermissions();
    // Abrir modal usando Bootstrap
    const permissionsModal = document.getElementById('permissionsModal');
    if (permissionsModal) {
      new bootstrap.Modal(permissionsModal).show();
    }
  }

  // Cargar roles desde el backend
  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  // Cargar todos los permisos disponibles
  loadPermissions(): void {
    this.rolesService.getAllPermissions().subscribe({
      next: (data) => {
        this.permissions = data;
      },
      error: (error) => console.error('Error al cargar permisos:', error)
    });
  }

  // Cargar permisos asignados al rol seleccionado
  loadRolePermissions(): void {
    if (this.selectedRoleId === null) {
      console.warn('No se ha seleccionado ningún rol.');
      return;
    }
  
    this.rolesService.getRolePermissions(this.selectedRoleId).subscribe({
      next: (data) => {
        this.rolePermissions = data;
        this.filterAvailablePermissions(); // Filtra los permisos disponibles
      },
      error: (error) => {
        console.error('Error al cargar permisos del rol:', error);
        this.rolePermissions = [];
      },
    });
  }
  
  
  // Filtrar permisos disponibles (no asignados al rol)
  filterAvailablePermissions(): void {
    this.allPermissions = this.permissions.filter(
      (permiso) => !this.rolePermissions.some((rp) => rp.PermisoID === permiso.PermisoID)
    );
  }

  

  // Asignar un permiso al rol
  assignPermission(permissionId: number): void {
    if (this.selectedRoleId === null) {
      Swal.fire('Error', 'No se ha seleccionado ningún rol.', 'error');
      return;
    }
  
    // Obtener el token del almacenamiento
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire('Error', 'Usuario no autenticado.', 'error');
      return;
    }
  
    // Decodificar el token para obtener el ID del usuario
    const decodedToken: any = jwtDecode(token);
    const asignadoPor = decodedToken.userId; // Asegúrate de que `userId` es la clave correcta en tu token
  
    this.rolesService.assignPermissionToRole(this.selectedRoleId, permissionId, asignadoPor).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Permiso asignado correctamente.', 'success');
        this.loadRolePermissions();
      },
      error: (error) => {
        console.error('Error al asignar permiso:', error);
        Swal.fire('Error', 'No se pudo asignar el permiso.', 'error');
      },
    });
  }
  
  

  // Eliminar un permiso del rol
  removePermission(permissionId: number): void {
    if (this.selectedRoleId === null) {
      Swal.fire('Error', 'No se ha seleccionado ningún rol.', 'error');
      return;
    }

    this.rolesService.removePermissionFromRole(this.selectedRoleId, permissionId).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Permiso eliminado correctamente.', 'success');
        this.loadRolePermissions();
      },
      error: (error) => {
        console.error('Error al eliminar permiso:', error);
        Swal.fire('Error', 'No se pudo eliminar el permiso.', 'error');
      }
    });
  }

  // Guardar cambios en el formulario
  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      Swal.fire('Error', 'Por favor completa los campos requeridos.', 'error');
      return;
    }

    const roleData = this.roleForm.value;

    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor espera mientras se procesa la solicitud.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.isEditing && this.editingRoleId !== null) {
      this.rolesService.updateRole(this.editingRoleId, roleData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Rol actualizado correctamente.', 'success');
          this.resetForm();
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al actualizar rol:', error);
          Swal.fire('Error', 'No se pudo actualizar el rol.', 'error');
        }
      });
    } else {
      this.rolesService.createRole(roleData).subscribe({
        next: () => {
          Swal.fire('Éxito', 'Rol creado correctamente.', 'success');
          this.resetForm();
          this.loadRoles();
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          Swal.fire('Error', 'No se pudo crear el rol.', 'error');
        }
      });
    }
  }

  // Editar rol existente
  onEdit(role: any): void {
    this.isEditing = true;
    this.editingRoleId = role.RolID;
    this.roleForm.patchValue(role);
  }

  // Cancelar edición o creación
  onCancel(): void {
    this.resetForm();
  }

  // Eliminar un rol
  onDelete(roleId: number): void {
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

  // Resetear formulario
  resetForm(): void {
    this.roleForm.reset();
    this.isEditing = false;
    this.editingRoleId = null;
    this.selectedRoleId = null;
    this.rolePermissions = [];
  }
}
