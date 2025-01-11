import type { Response, NextFunction, RequestHandler } from 'express';
import type { AuthRequest, JWTPayload } from '@/types/auth.types';
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

export const authMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      res.status(401).json({ message: 'No se proporcionó token de autenticación' });
      return;
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret'
    ) as JWTPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
};

export const hasRole = (roles: string[]): RequestHandler => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }

  RoleService.getUserRoles(userId)
    .then(userRoles => {
      const hasRequiredRole = userRoles.some(role => roles.includes(role.Nombre));

      if (!hasRequiredRole) {
        res.status(403).json({ 
          message: 'No tienes los roles necesarios para acceder a este recurso' 
        });
        return;
      }

      next();
    })
    .catch(() => {
      res.status(500).json({ message: 'Error al verificar roles' });
    });
};

export const hasPermission = (permissions: string[]): RequestHandler => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }

  RoleService.getUserPermissions(userId)
    .then(userPermissions => {
      const hasRequiredPermission = userPermissions.some(permission => 
        permissions.includes(permission.Codigo)
      );

      if (!hasRequiredPermission) {
        res.status(403).json({ 
          message: 'No tienes los permisos necesarios para realizar esta acción' 
        });
        return;
      }

      next();
    })
    .catch(() => {
      res.status(500).json({ message: 'Error al verificar permisos' });
    });
};

export const checkAccess = (config: {
  roles?: string[];
  permissions?: string[];
}): RequestHandler => (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }

  const checkRoles = async (): Promise<boolean> => {
    if (!config.roles?.length) return true;
    const userRoles = await RoleService.getUserRoles(userId);
    return userRoles.some(role => config.roles?.includes(role.Nombre));
  };

  const checkPermissions = async (): Promise<boolean> => {
    if (!config.permissions?.length) return true;
    const userPermissions = await RoleService.getUserPermissions(userId);
    return userPermissions.some(permission => 
      config.permissions?.includes(permission.Codigo)
    );
  };

  Promise.all([checkRoles(), checkPermissions()])
    .then(([hasRoles, hasPermissions]) => {
      if (!hasRoles || !hasPermissions) {
        res.status(403).json({ 
          message: 'No tienes los permisos necesarios para realizar esta acción' 
        });
        return;
      }
      next();
    })
    .catch(() => {
      res.status(500).json({ message: 'Error al verificar acceso' });
    });
};