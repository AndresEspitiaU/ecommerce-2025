import { INavData } from '@coreui/angular';

export interface CustomNavData extends INavData {
  data?: {
    permissions?: string[]; // Permisos requeridos
  };
}
