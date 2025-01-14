import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar, NgScrollbarState } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';

import { AuthService } from '../../services/auth.service';
import { CustomNavData } from './custom-nav-data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
  ],
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: CustomNavData[] = navItems; // Usar la interfaz extendida

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userPermissions = this.authService.getUserPermissions();
    console.log('Permisos del usuario:', userPermissions);
  
    this.filterNavItemsByPermissions();
  
    console.log('Elementos del menú filtrados:', this.navItems);
  }
  

  /**
   * Filtrar elementos del menú según los permisos del usuario.
   */
  filterNavItemsByPermissions(): void {
    const userPermissions = this.authService.getUserPermissions();
  
    this.navItems = navItems.filter(item => {
      if (item.data?.permissions) {
        const hasPermission = item.data.permissions.every(permission => userPermissions.includes(permission));
        console.log(`Revisando ítem: ${item.name}, Permisos requeridos: ${item.data.permissions}, Acceso: ${hasPermission}`);
        return hasPermission;
      }
      return true;
    });
  }

  /**
   * Manejar eventos de actualización del scrollbar.
   * @param state Estado del scrollbar.
   */
  onScrollbarUpdate(state: NgScrollbarState): void {
    console.log('Scrollbar updated:', state);
    // Agregar cualquier lógica necesaria al actualizar el scrollbar
  }

  /**
   * Mostrar roles y permisos del usuario en consola.
   */
  logUserRolesAndPermissions(): void {
    const roles = this.authService.getUserRoles();
    const permissions = this.authService.getUserPermissions();

    console.log('Roles del usuario:', roles);
    console.log('Permisos del usuario:', permissions);
  }
}
