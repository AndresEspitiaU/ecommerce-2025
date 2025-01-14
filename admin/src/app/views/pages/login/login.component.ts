import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridModule, CardModule, ButtonModule, FormModule } from '@coreui/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GridModule,       // Para c-container, c-row, c-col
    CardModule,       // Para c-card, c-card-body
    ButtonModule,     // Para cButton
    FormModule        // Para cFormControl, cInputGroup
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  isActive = true;
  ubmitted = false; // Agregar la propiedad submitted
  isLoading = false; // Agregar la propiedad isLoading
  showPassword = false; // Agregar la propiedad showPassword


  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        const token = this.authService.getToken();
        console.log('Token:', token);
    
        const roles = this.authService.getUserRoles();
        const permissions = this.authService.getUserPermissions();
    
        console.log('Roles del usuario:', roles);
        console.log('Permisos del usuario:', permissions);
    
        this.router.navigate(['/dashboard']); // Redirige al dashboard después del login
      },
      error: (error) => {
        this.errorMessage = 'Error en el inicio de sesión';
      },
      complete: () => {
        this.isLoading = false; // Desactivar indicador de carga
      }
    });
  }
}
