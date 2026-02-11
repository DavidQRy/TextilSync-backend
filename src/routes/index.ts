
import { loginController } from '#controllers/auth.controller';
import { registerController } from '#controllers/auth.controller';
import { createUserController, deleteUserController, getUserByIDController, getUsersController, updateUserController } from '#controllers/user.controller';
import { authenticate } from '#middlewares/auth.middleware';
import { authorizeRole } from '#middlewares/role.middleware';
import validate from '#middlewares/validate.middleware';
import { loginSchema, registerSchema } from '#schemas/auth.schema';
import { userCreateSchema, userUpdateSchema } from '#schemas/user.schema';
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

// GET    /api/users
router.get('/users', authenticate, authorizeRole(1,2), getUsersController)

// // GET    /api/users/:id
router.get('/users/:id', authenticate, authorizeRole(1,2), getUserByIDController)

// POST   /api/users
router.post('/users', authenticate, authorizeRole(1), validate(userCreateSchema), createUserController)

// PUT    /api/users/:id
router.patch('/users/:id', authenticate, authorizeRole(1,2), validate(userUpdateSchema), updateUserController)

// // PATCH  /api/users/:id/status
// router.patch('/users/:id')

// DELETE /api/users/:id
router.delete('/users/:id', authenticate, authorizeRole(1), validate(userUpdateSchema), deleteUserController)

// GET    /api/company/me
// PUT    /api/company
// GET    /api/company/users



export default router;