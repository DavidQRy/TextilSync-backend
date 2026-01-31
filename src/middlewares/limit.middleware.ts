import { LIMIT, LIMIT_MESSAGE } from '#config/environment';
import rateLimit from 'express-rate-limit';

/**
 * Crea una instancia de middleware de limitador de tasa (rate limiter) para Express.
 * @param {boolean} [skip=false] - Omitir el rate limit, sólo recomendado para ambientes no productivos como desarrollo
 * @returns {Function} Middleware configurado con las opciones de limitación.
 * @see https://www.npmjs.com/package/express-rate-limit
 * @example
 * app.use(limiter()); // Aplica el limitador globalmente
 * @example
 * app.use('/api', limiter()); // Aplica el limitador a rutas específicas
 */
export const limiter = (skip = false) => rateLimit({
  skip: () => skip,
  windowMs: 30 * 1000,
  limit: Number(LIMIT),
  message: LIMIT_MESSAGE,
  legacyHeaders: false
});
