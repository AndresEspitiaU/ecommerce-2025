// src/middlewares/auth.middleware.ts
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '@/types/auth.types';
import type { JWTPayload } from '@/types/auth.types';
import jwt from 'jsonwebtoken';
import { RoleService } from '@/services/role.service';

const getTokenFromHeader = (req: AuthRequest): string | null => {
  if (!req.headers.authorization) {
    return null;
  }

  const [bearer, token] = req.headers.authorization.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const hasRole = (roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      const userRoles = await RoleService.getUserRoles(req.user.userId);
      const hasRequiredRole = userRoles.some(role => 
        roles.includes(role.Nombre)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({ 
          message: 'No tienes los roles necesarios para acceder a este recurso' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al verificar roles' 
      });
    }
  };
};

export const hasPermission = (permissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      const userPermissions = await RoleService.getUserPermissions(req.user.userId);
      const hasRequiredPermission = userPermissions.some(permission => 
        permissions.includes(permission.Codigo)
      );

      if (!hasRequiredPermission) {
        return res.status(403).json({ 
          message: 'No tienes los permisos necesarios para realizar esta acción' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al verificar permisos' 
      });
    }
  };
};

// Middleware combinado para verificar múltiples condiciones
export const checkAccess = (config: {
  roles?: string[];
  permissions?: string[];
}) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ message: 'No autorizado' });
      }

      let hasAccess = true;

      if (config.roles) {
        const userRoles = await RoleService.getUserRoles(req.user.userId);
        hasAccess = userRoles.some(role => config.roles?.includes(role.Nombre));
      }

      if (hasAccess && config.permissions) {
        const userPermissions = await RoleService.getUserPermissions(req.user.userId);
        hasAccess = userPermissions.some(permission => 
          config.permissions?.includes(permission.Codigo)
        );
      }

      if (!hasAccess) {
        return res.status(403).json({ 
          message: 'No tienes los permisos necesarios para realizar esta acción' 
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ 
        message: 'Error al verificar acceso' 
      });
    }
  };
};