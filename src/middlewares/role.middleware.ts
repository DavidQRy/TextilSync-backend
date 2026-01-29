import { Request, Response, NextFunction } from 'express';

export const authorizeRole =
  (...allowedRoles: number[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'No autenticado',
        code: 401,
      });
    }

    if (!allowedRoles.includes(req.user.roleId)) {
      return res.status(403).json({
        message: 'No tienes permisos para esta acción',
        code: 403,
      });
    }

    return next();
  };
