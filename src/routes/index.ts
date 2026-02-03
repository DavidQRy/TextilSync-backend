
import { loginController } from '#controllers/auth.controller';
import { registerController } from '#controllers/auth.controller';
import { createUserController } from '#controllers/user.controller';
import { authenticate } from '#middlewares/auth.middleware';
import { authorizeRole } from '#middlewares/role.middleware';
import validate from '#middlewares/validate.middleware';
import { loginSchema, registerSchema } from '#schemas/auth.schema';
import { userCreateSchema } from '#schemas/user.schema';
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

// // GET    /api/users
// router.get('/users')

// // GET    /api/users/:id
// router.get('/users/:id')

// POST   /api/users
router.post('/users', authenticate, authorizeRole(1), validate(userCreateSchema), createUserController)

// // PUT    /api/users/:id
// router.put('/users/:id')

// // PATCH  /api/users/:id/status
// router.patch('/users/:id')

// // DELETE /api/users/:id
// router.delete('/users/:id')



export default router;