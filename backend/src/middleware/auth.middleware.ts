import type { Response, NextFunction, RequestHandler } from 'express';
import type { AuthRequest, JWTPayload } from '@/types/auth.types';
import jwt from 'jsonwebtoken';
import { RoleService } from '@/services/role.service';

// 
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

// 
export const authMiddleware: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      res.status(401).json({ message: 'No se proporcionó token de autenticación' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;

    if (!decoded.roles || !decoded.permisos) {
      const roles = await RoleService.getUserRoles(decoded.userId);
      const permisos = await RoleService.getUserPermissions(decoded.userId);
      req.user = {
        ...decoded,
        roles: roles.map((role) => role.Nombre),
        permisos: permisos.map((permiso) => permiso.Codigo),
      };
    } else {
      req.user = decoded; 
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};


export const hasRole = (roles: string[]): RequestHandler => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userRoles = req.user?.roles;

  if (!userRoles || !roles.some((role) => userRoles.includes(role))) {
    res.status(403).json({ message: 'No tienes los roles necesarios para acceder a este recurso' });
    return;
  }

  next();
};


export const hasPermission = (permissions: string[]): RequestHandler => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userPermissions = req.user?.permisos;

  if (!userPermissions || !permissions.some((perm) => userPermissions.includes(perm))) {
    res.status(403).json({ message: 'No tienes los permisos necesarios para realizar esta acción' });
    return;
  }

  next();
};


export const checkAccess = (config: {
  roles?: string[];
  permissions?: string[];
}): RequestHandler => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { roles = [], permissions = [] } = config;

  const userRoles = req.user?.roles || [];
  const userPermissions = req.user?.permisos || [];

  const hasRoles = !roles.length || roles.some((role) => userRoles.includes(role));
  const hasPermissions = !permissions.length || permissions.some((perm) => userPermissions.includes(perm));

  if (!hasRoles || !hasPermissions) {
    res.status(403).json({ message: 'No tienes los permisos necesarios para realizar esta acción' });
    return;
  }

  next();
};
