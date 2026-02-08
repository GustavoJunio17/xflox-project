import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';

interface TokenPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Rotas públicas que não precisam de autenticação
  const publicPaths: Array<{ method?: string; path: string }> = [
    { path: '/health' },
    { path: '/login', method: 'POST' }, // matches /api/v1/auth/login
    { path: '/users', method: 'POST' }, // matches /api/v1/users
  ];

  // Check if path starts with a public route (after the prefix)
  const fullPath = req.path;
  const isPublic = publicPaths.some(p => {
    if (p.method && p.method !== req.method) return false;
    return fullPath === p.path || fullPath.endsWith(p.path);
  });

  if (isPublic) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token error' });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    // Attach user info to request
    (req as any).user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;
