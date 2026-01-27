import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#config/environment';
import { JwtPayload } from '#types/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(403).json({
      message: 'Token no proporcionado',
      code: 403,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    res.json({
        status: 200,
        ...decoded
    })
    // return next();
  } catch {
    return res.status(401).json({
      message: 'Token inválido o expirado',
      code: 401,
    });
  }
};
