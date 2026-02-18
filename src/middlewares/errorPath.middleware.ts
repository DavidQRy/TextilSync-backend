import { Request ,Response, NextFunction } from "express";
import status from "http-status";

export const errorPath = (req: Request, res: Response, _next: NextFunction) => {
  res.status(status.NOT_FOUND).json({ 
    status: status.NOT_FOUND,
    message: 'Ruta no encontrada',
    path: req.originalUrl 
  });
};