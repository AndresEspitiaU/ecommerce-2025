import { db } from '@/config/database';

export class UserService {

  static async assignRolesToUser(userId: number, roles: string[]) {
    // Eliminar roles existentes del usuario
    await db.query(`
      DELETE FROM UsuariosRoles WHERE UsuarioID = @userId
    `, { userId });

    // Asignar nuevos roles al usuario
    for (const role of roles) {
      const roleIdResult = await db.query<{ RolID: number }>(`
        SELECT RolID FROM Roles WHERE nombre = @role
      `, { role });

      if (roleIdResult.length > 0) {
        const roleId = roleIdResult[0].RolID;
        await db.query(`
          INSERT INTO UsuariosRoles (UsuarioID, RolID)
          VALUES (@userId, @roleId)
        `, { userId, roleId });
      }
    }
  }
}