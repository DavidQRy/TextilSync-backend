
import { loginController } from '#controllers/auth.controller';
import { registerController } from '#controllers/auth.controller';
import { authenticate } from '#middlewares/auth.middleware';
import { authorizeRole } from '#middlewares/role.middleware';
import validate from '#middlewares/validate.middleware';
import { loginSchema, registerSchema } from '#schemas/auth.schema';
import { Router } from 'express';


const router = Router();

router.post(
    '/auth/register',
    validate(registerSchema),
    registerController
);

router.post(
    '/auth/login',
    validate(loginSchema),
    loginController
);

router.get('/me', authenticate)

router.post(
  '/users',
  authenticate,
  authorizeRole(1)
);

// ADMIN y MANAGER
router.get(
  '/reports',
  authenticate,
  authorizeRole(1, 2)
);


export default router;