import {JWT_EXPIRES, JWT_SECRET } from '#config/environment';
import jwt from 'jsonwebtoken';

/**
 * Valida credenciales recibidas desde el body y genera un JWT válido.
 *
 * Esta función compara las credenciales enviadas por el cliente con los valores
 * configurados en variables de entorno. Si son correctas, genera un token JWT
 * firmado con el secreto definido en la configuración del sistema.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {import('express').Response} Devuelve una respuesta JSON con el token generado
 * o un error 401 si las credenciales son inválidas.
 * @example
 * // POST /api/auth
 * // Body:
 * // { "username": "parcha_admin", "password": "1234" }
 *
 * const response = await fetch('/api/auth', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ username: 'parcha_admin', password: '1234' })
 * });
 * const data = await response.json();
 * console.log(data.token); // -> token JWT válido
 */
export const authorizeAndGenerateToken = (req, res) => {
  const { username, password } = req.body;

  if (username !== AUTH_USER || password !== AUTH_PASSWORD) {
    return res.status(401).json({
      message: 'Credenciales inválidas',
      code: 401,
    });
  }

  const payload = { username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

  return res.status(200).json({ token });
};

/**
 * Middleware que autentica una solicitud HTTP mediante un token JWT.
 *
 * Este middleware verifica la existencia del token en el encabezado
 * `Authorization: Bearer <token>`. Si el token es válido, se agrega el
 * payload decodificado en `req.user` y se permite continuar con la petición.
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @param {import('express').NextFunction} next - Función para continuar con el flujo de middlewares.
 * @returns {import('express').Response|void} Responde con un error HTTP si el token es inválido o no existe,
 * o ejecuta `next()` si la autenticación es exitosa.
 * @example
 * // Uso en una ruta protegida
 * import { authenticate } from '#middlewares/authjwt.middleware';
 *
 * router.post('/api/secure', authenticate, (req, res) => {
 *   res.json({ message: `Bienvenido ${req.user.username}` });
 * });
 * @throws {Error} TokenExpiredError - Si el token ya expiró.
 * @throws {Error} JsonWebTokenError - Si el token no es válido.
 */
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({
      message: 'Token no proporcionado',
      code: 403,
    });
  }

  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: 'Token inválido',
        code: 401,
      });
    }

    req.user = decoded;
    return next();
  });
};