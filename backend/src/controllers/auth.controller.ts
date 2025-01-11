// src/controllers/auth.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/auth.service';
import type { RequestHandler } from 'express';

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

interface LoginRequest {
  email: string;
  password: string;
}

export class AuthController {
  // METODO PARA REGISTRAR UN USUARIO
  static register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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
      } = req.body as RegisterRequest;

      if (!email || !password || !nombres || !apellidos || !nombreUsuario) {
        res.status(400).json({
          message: 'Faltan campos requeridos'
        });
        return;
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

      res.status(201).json(result);
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error en registro'
      });
    }
  };

  // METODO PARA INICIAR SESION
  static login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body as LoginRequest;

      if (!email || !password) {
        res.status(400).json({
          message: 'Faltan campos requeridos'
        });
        return;
      }

      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      console.error('Error en login:', error);
      res.status(400).json({
        message: error instanceof Error ? error.message : 'Error en login'
      });
    }
  };
}