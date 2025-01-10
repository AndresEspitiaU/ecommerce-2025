// src/services/auth.service.ts
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'; // Importar jsonwebtoken
import { db } from '@/config/database';
import type { IUser } from '@/types/user.types';

interface RegisterDetails {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  telefono?: string;
  fechaNacimiento?: Date;
  genero?: string;
}

interface LoginResponse {
  token: string;
  user: {
    UsuarioID: number;
    Email: string;
    Nombres: string;
    Apellidos: string;
    NombreUsuario: string;
    Estado: string;
    IdiomaPreferido: string;
    ZonaHoraria: string;
  }
}

interface LoginUser {
  UsuarioID: number;
  Contraseña: string;
  SaltContraseña: string;
  IntentosFallidos: number;
  BloqueoHasta: Date | null;
  Estado: string;
  EmailConfirmado: boolean;
}

export class AuthService {

  // METODO PARA REGISTRAR UN USUARIO
  static async register(userDetails: RegisterDetails) {
    try {
      // Verificar email duplicado
      const emailExists = await db.query<{ count: number }>(`
        SELECT COUNT(*) as count 
        FROM Usuarios 
        WHERE Email = @Email
      `, { Email: userDetails.email });

      if (emailExists[0].count > 0) {
        throw new Error('El email ya está registrado');
      }

      // Verificar nombre de usuario duplicado
      const usernameExists = await db.query<{ count: number }>(`
        SELECT COUNT(*) as count 
        FROM Usuarios 
        WHERE NombreUsuario = @NombreUsuario
      `, { NombreUsuario: userDetails.nombreUsuario });

      if (usernameExists[0].count > 0) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      // Generar salt y hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userDetails.password + salt, 10);
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Insertar usuario
      const insertQuery = `
        DECLARE @InsertedUser TABLE (UsuarioID INT);

        INSERT INTO Usuarios (
          Email,
          Contraseña,
          SaltContraseña,
          Nombres,
          Apellidos,
          NombreUsuario,
          Telefono,
          FechaNacimiento,
          Genero,
          TokenVerificacion,
          Estado,
          FechaCreacion,
          EmailConfirmado,
          IdiomaPreferido,
          ZonaHoraria
        )
        OUTPUT INSERTED.UsuarioID INTO @InsertedUser
        VALUES (
          @Email,
          @Password,
          @Salt,
          @Nombres,
          @Apellidos,
          @NombreUsuario,
          @Telefono,
          @FechaNacimiento,
          @Genero,
          @TokenVerificacion,
          'PENDIENTE',
          GETDATE(),
          1,
          'es',
          'America/Bogota'
        );

        SELECT UsuarioID FROM @InsertedUser;
      `;

      const insertResult = await db.query<{ UsuarioID: number }>(insertQuery, {
        Email: userDetails.email,
        Password: hashedPassword,
        Salt: salt,
        Nombres: userDetails.nombres,
        Apellidos: userDetails.apellidos,
        NombreUsuario: userDetails.nombreUsuario,
        Telefono: userDetails.telefono || null,
        FechaNacimiento: userDetails.fechaNacimiento || null,
        Genero: userDetails.genero || null,
        TokenVerificacion: verificationToken
      });

      if (!insertResult || insertResult.length === 0) {
        throw new Error('Error al crear el usuario');
      }

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        userId: insertResult[0].UsuarioID
      };

    } catch (error) {
      console.error('Error en AuthService.register:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error en el registro');
    }
  }

  // METODO PARA INICIAR SESION
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Obtener el usuario
      const users = await db.query<LoginUser>(`
        SELECT 
          UsuarioID, 
          Contraseña, 
          SaltContraseña, 
          IntentosFallidos, 
          BloqueoHasta,
          Estado,
          EmailConfirmado
        FROM Usuarios 
        WHERE Email = @Email AND Eliminado = 0
      `, { Email: email });

      if (!users || users.length === 0) {
        throw new Error('Credenciales inválidas');
      }

      const user = users[0];

      // Verificar estado de la cuenta
      if (user.Estado === 'SUSPENDIDO' || user.Estado === 'BANEADO') {
        throw new Error('Esta cuenta se encuentra deshabilitada');
      }

      // Comentamos temporalmente la verificación de email
      /* 
      if (!user.EmailConfirmado) {
        throw new Error('Por favor confirma tu email antes de iniciar sesión');
      }
      */

      // Verificar si la cuenta está bloqueada
      if (user.BloqueoHasta && new Date(user.BloqueoHasta) > new Date()) {
        const tiempoRestante = Math.ceil(
          (new Date(user.BloqueoHasta).getTime() - new Date().getTime()) / 1000 / 60
        );
        throw new Error(`Cuenta bloqueada temporalmente. Intenta de nuevo en ${tiempoRestante} minutos`);
      }

      // Verificar la contraseña
      const isValid = await bcrypt.compare(password + user.SaltContraseña, user.Contraseña);
      if (!isValid) {
        // Actualizar intentos fallidos
        await db.query(`
          UPDATE Usuarios 
          SET 
            IntentosFallidos = IntentosFallidos + 1,
            BloqueoHasta = CASE 
              WHEN IntentosFallidos + 1 >= 5 THEN DATEADD(MINUTE, 30, GETDATE())
              ELSE NULL 
            END
          WHERE UsuarioID = @UsuarioID
        `, { UsuarioID: user.UsuarioID });
        
        throw new Error('Credenciales inválidas');
      }

      // Resetear intentos fallidos y actualizar último acceso
      await db.query(`
        UPDATE Usuarios 
        SET 
          IntentosFallidos = 0,
          UltimoAcceso = GETDATE(),
          BloqueoHasta = NULL
        WHERE UsuarioID = @UsuarioID
      `, { UsuarioID: user.UsuarioID });

      // Generar token JWT
      const token = jwt.sign(
        { userId: user.UsuarioID },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Obtener datos del usuario para la respuesta
      const userData = await db.query<LoginResponse['user']>(`
        SELECT 
          UsuarioID,
          Email,
          Nombres,
          Apellidos,
          NombreUsuario,
          Estado,
          IdiomaPreferido,
          ZonaHoraria
        FROM Usuarios
        WHERE UsuarioID = @UsuarioID
      `, { UsuarioID: user.UsuarioID });

      if (!userData || userData.length === 0) {
        throw new Error('Error al obtener datos del usuario');
      }

      return {
        token,
        user: userData[0]
      };

    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
}