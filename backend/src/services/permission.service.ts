import { db } from '@/config/database';

export class PermissionService {

  // OBTENER TODOS LOS PERMISOS
  static async getAllPermissions(): Promise<any[]> {
    try {
      const permissions = await db.query(`
        SELECT PermisoID, Nombre, Codigo, Descripcion, Modulo, Activo
        FROM Permisos
        WHERE Activo = 1
      `);
      return permissions;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw new Error('Error al obtener permisos');
    }
  }
}
