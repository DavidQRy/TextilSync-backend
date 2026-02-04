import { Request, Response, NextFunction } from 'express';
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
    return res.status(403).json({ message: 'Token no proporcionado', code: 403 });
  }

  // 1. Validamos el secreto para eliminar el error de 'undefined'
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado');
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verificamos el token. jwt.verify devuelve string | JwtPayload (de la librería)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Validación de tipo: Comprobamos que no sea un string y que tenga las propiedades de tu interfaz
    if (typeof decoded === 'object' && decoded !== null) {
      const payload = decoded as unknown as JwtPayload;
      
      // 4. req.user ya no da error gracias al archivo .d.ts
      req.user = payload; 
      return next();
    }
    
    throw new Error('Formato de token inválido');

  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido o expirado',
      code: 401,
    });
  }
};