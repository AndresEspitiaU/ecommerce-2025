// src/types/auth.types.ts
// src/types/auth.types.ts
import type { Request } from 'express';

export interface JWTPayload {
  userId: number;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}