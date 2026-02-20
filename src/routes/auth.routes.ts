import { Router } from 'express';
import { loginController, registerController } from '#controllers/auth.controller';
import { authenticate } from '#middlewares/auth.middleware';
import validate from '#middlewares/validate.middleware';
import { loginSchema, registerSchema } from '#schemas/auth.schema';

const router = Router();

// Endpoint: POST /auth/register
router.post(
  '/register', 
  validate(registerSchema), 
  registerController
);

// Endpoint: POST /auth/login
router.post(
  '/login', 
  validate(loginSchema), 
  loginController
);

// Endpoint: GET /auth/me 
// (Lo mantenemos bajo /auth para que tenga sentido semántico)
router.get('/me', authenticate, (req, res) => {
    // Normalmente aquí devuelves el usuario que el middleware 'authenticate' inyectó en req
    res.status(200).json(req.user); 
});

export const authRoute = router;