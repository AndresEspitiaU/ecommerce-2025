// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service'; // Cambiado para usar importación nombrada

interface RegisterRequest {
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  nombreUsuario: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
}

export class AuthController {

  // METODO PARA REGISTRAR UN USUARIO
  static async register(req: Request<any, any, RegisterRequest>, res: Response) {
    try {
      const { 
        email, 
        password, 
        nombres, 
        apellidos, 
        nombreUsuario,
        telefono,
        fechaNacimiento,
        genero 
      } = req.body;

      if (!email || !password || !nombres || !apellidos || !nombreUsuario) {
        return res.status(400).json({
          message: 'Faltan campos requeridos'
        });
      }

      const result = await AuthService.register({
        email,
        password,
        nombres,
        apellidos,
        nombreUsuario,
        telefono,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        genero
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error en registro'
      });
    }
  }

  // METODO PARA INICIAR SESION
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Faltan campos requeridos'
        });
      }

      const result = await AuthService.login(email, password);

      return res.json(result);
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Error en login'
      });
    }
  }

  
}