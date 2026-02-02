import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  code?: number | string;
}


/**
 * Handles errors and sends an error response with the appropriate status code and message.
 * @param {Error} err - The error object.
 * @param {object} _req - The request object.
 * @param {object} res - The response object.
 * @param {Function} _next - The next middleware function.
 * @returns {void}
 * @example
 * app.use(errorHandler);
 */
const errorHandler = (
  err: AppError ,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    code: httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;